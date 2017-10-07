import {Invoices} from '../../../imports/api/collections/invoice';
import {Exchange} from '../../../../core/imports/api/collections/exchange';
import {exchangeCoefficient} from '../../../imports/api/libs/exchangeCoefficient';

Meteor.methods({
    printBillA5({_id}) {
        let exchange = Exchange.findOne({}, {_id: -1});
        let data = {
            exchange: `1$ = ${numeral(exchange.rates['KHR']).format('0,0')}រៀល, ${numeral(exchange.rates['THB']).format('0,0')}បាត`,
            content: {}
        };
        let exchangeSelector = exchangeCoefficient({exchange, fieldToCalculate: '$total'});
        let invoices = Invoices.aggregate([
            {
                $match:
                    {$or: [{_id}, {printId: _id}]}
            },
            {
                $lookup: {
                    from: 'pos_customers',
                    localField: 'customerId',
                    foreignField: '_id',
                    as: 'customerDoc'
                }
            },
            {
                $unwind: {path: '$customerDoc', preserveNullAndEmptyArrays: true}
            },
            {
                $lookup: {
                    from: 'pos_receivePayment',
                    localField: '_id',
                    foreignField: 'invoiceId',
                    as: 'paymentDoc'
                }
            },
            {
                $project: {
                    _id: 1,
                    saleId: {$ifNull: ['$voucherId', '$_id']},
                    sale: '$customerDoc',
                    invoiceDate: 1,
                    items: 1,
                    des: 1,
                    paymentObj: {
                        paidAmount: {$sum: "$paymentDoc.paidAmount"},
                        balanceAmount: {$subtract: ['$total', {$sum: "$paymentDoc.paidAmount"}]}
                    },
                    total: exchangeSelector
                }
            },
            {
                $unwind: {path: '$items', preserveNullAndEmptyArrays: true}
            },
            {
                $lookup: {
                    from: 'pos_item',
                    localField: 'items.itemId',
                    foreignField: '_id',
                    as: 'items.itemDoc'
                }
            },
            {
                $unwind: {path: '$items.itemDoc', preserveNullAndEmptyArrays: true}
            },
            {
                $group: {
                    _id: '$_id',
                    paymentObj: {$last: '$paymentObj'},
                    saleId: {
                        $last: '$saleId'
                    },
                    invoiceDate: {
                        $last: '$invoiceDate'
                    },
                    sale: {
                        $last: '$sale'
                    },
                    des: {
                        $last: '$des'
                    },
                    items: {
                        $push: '$items'
                    },
                    totalKhr: {$last: '$total.khr'},
                    totalThb: {$last: '$total.thb'},
                    totalUsd: {$last: '$total.usd'}
                }
            },

        ]);
        if (invoices.length > 0) {
            data.content = invoices[0];
            return data;
        }
        return {};
    }
});