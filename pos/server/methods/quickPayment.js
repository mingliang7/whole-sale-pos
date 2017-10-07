import {Invoices} from '../../imports/api/collections/invoice';
Meteor.methods({
    getInvoiceDocForQuickPayment({printId}){
        let invoice = Invoices.findOne({printId});
        return invoice;
    }
});