import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {CallPromiseMixin} from 'meteor/didericis:callpromise-mixin';

// Collection
import {RingPullTransfers} from '../../imports/api/collections/ringPullTransfer.js';
// Check user password
export const ringPullTransferInfo = new ValidatedMethod({
    name: 'pos.ringPullTransferInfo',
    mixins: [CallPromiseMixin],
    validate: new SimpleSchema({
        _id: {
            type: String
        }
    }).validator(),
    run({
        _id
    }) {
        if (!this.isSimulation) {
            let ringPullTransfer = RingPullTransfers.aggregate([{$match: {_id: _id}},{
                $unwind: '$items'
            }, {
                $lookup: {
                    from: "pos_item",
                    localField: "items.itemId",
                    foreignField: "_id",
                    as: "fItems"
                }
            }, {
                $unwind: '$fItems'
            }, {
                $group: {
                    _id: '$_id',
                    data: {
                        $addToSet: {
                            _id: '$_id',
                            ringPullTransferDate: '$ringPullTransferDate',
                            des: '$des',
                            customer: '$_customer.name',
                            total: '$total'
                        }
                    },
                    items: {
                        $addToSet: {
                            itemId: '$items.itemId',
                            name: '$fItems.name',
                            qty: '$items.qty',
                            price: '$items.price',
                            amount: '$items.amount',
                        }
                    }
                }
            }, {
                $unwind: '$data'
            }]);

            return ringPullTransfer[0];
        }
    }
});
