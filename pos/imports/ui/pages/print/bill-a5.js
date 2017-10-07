import './bill-a5.html';

Template.printBillA5.onCreated(function () {
    let id = FlowRouter.query.get('billId');
    this.reportData = new ReactiveVar({});
    this.autorun(() => {
        if (id) {
            Meteor.call("printBillA5", {_id: id}, (er, re) => {
                if (!er) {
                    console.log(re);
                    this.reportData.set(re);
                }
            });
        }
    });
});
Template.printBillA5.helpers({
    hasPayment(paymentObj) {
        return !!paymentObj;
    },
    company(){
        let doc = Session.get('currentUserStockAndAccountMappingDoc');
        return doc && doc.company;
    },
    data(){
        let instance = Template.instance();
        return instance.reportData.get();
    },
    no(index){
        return index + 1;
    }
});
Template.printBillA5.events({
    'click .printEnterBill'(event, instance){
        window.print();
    }
});