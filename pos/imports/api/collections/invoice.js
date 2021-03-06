import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';

// Lib
import {__} from '../../../../core/common/libs/tapi18n-callback-helper.js';
import {SelectOpts} from '../../ui/libs/select-opts.js';

export const Invoices = new Mongo.Collection("pos_invoices");
// Items sub schema
export const QuickPayment = new SimpleSchema({
    date: {
        type: Date,
        defaultValue: moment().toDate(),
        autoform: {
            afFieldInput: {
                type: "bootstrap-datetimepicker",
                dateTimePickerOptions: {
                    format: 'DD/MM/YYYY',
                }
            }
        }
    },
    invoiceId: {
        type: String,
    },
    dueAmount: {
        type: Number,
        decimal: true,
        autoform: {
            type: 'inputmask',
            inputmaskOptions: function () {
                return inputmaskOptions.currency({digits: 2});
            }
        }
    },
    paidAmount: {
        type: Number,
        decimal: true,
        autoform: {
            type: 'inputmask',
            inputmaskOptions: function () {
                return inputmaskOptions.currency({digits: 2});
            }
        }
    },
    balanceAmount: {
        type: Number,
        decimal: true
    },
    customerId: {
        type: String
    }
});
Invoices.itemsSchema = new SimpleSchema({
    itemId: {
        type: String
    },
    qty: {
        type: Number,
        decimal: true,
        min: 1
    },
    price: {
        type: Number,
        decimal: true,
        autoform: {
            type: 'inputmask',
            inputmaskOptions: function () {
                return inputmaskOptions.currency({digits: 2});
            }
        }
    },
    amount: {
        type: Number,
        decimal: true,
        autoform: {
            type: 'inputmask',
            inputmaskOptions: function () {
                return inputmaskOptions.currency({digits: 2});
            }
        }
    }
});

// Invoices schema
Invoices.schema = new SimpleSchema({
    printId: {
        type: String,
        optional: true
    },
    deliveryDate: {
        type: Date,
        autoform: {
            afFieldInput: {
                type: "bootstrap-datetimepicker",
                dateTimePickerOptions: {
                    format: 'DD/MM/YYYY',

                }
            }
        },
        optional: true,
    },
    voucherId: {
        type: String,
        optional: true
    },
    invoiceDate: {
        type: Date,
        defaultValue: moment().toDate(),
        autoform: {
            afFieldInput: {
                type: "bootstrap-datetimepicker",
                dateTimePickerOptions: {
                    format: 'DD/MM/YYYY HH:mm:ss',

                },
                value() {
                    let customerId = AutoForm.getFieldValue('customerId');
                    if (customerId) {
                        return moment().toDate();
                    }
                }
            }

        }
    },
    dueDate: {
        type: Date,
        defaultValue: moment().toDate(),
        autoform: {
            afFieldInput: {
                type: "bootstrap-datetimepicker",
                dateTimePickerOptions: {
                    format: 'DD/MM/YYYY HH:mm:ss',

                }
            }
        }
    },
    customerId: {
        type: String,
        autoform: {
            type: 'universe-select',
            afFieldInput: {
                uniPlaceholder: 'Please search .... (Limit 10)',
                optionsMethod: 'pos.selectOptMethods.customer',
                optionsMethodParams: function () {
                    if (Meteor.isClient) {
                        let currentBranch = Session.get('currentBranch');
                        return {branchId: currentBranch};
                    }
                }
            }
        }
    },
    termId: {
        type: String,
        label: 'Terms',
        optional: true,
        autoform: {
            type: 'universe-select',
            afFieldInput: {
                uniPlaceholder: 'Select One'
            }
        }
    },
    paymentGroupId: {
        type: String,
        optional: true
    },
    repId: {
        type: String,
        autoform: {
            type: 'universe-select',
            afFieldInput: {
                uniPlaceholder: 'Select One'
            }
        }
    },
    staffId: {
        type: String,
        autoValue() {
            if (this.isInsert) {
                return Meteor.user()._id;
            }
        }
    },
    des: {
        type: String,
        optional: true,
        autoform: {
            afFieldInput: {
                type: 'textarea',
                rows: 5
            }
        }
    },
    items: {
        type: [Invoices.itemsSchema]
    },
    total: {
        type: Number,
        decimal: true,
        autoform: {
            type: 'inputmask',
            inputmaskOptions: function () {
                return inputmaskOptions.currency();
            }
        }
    },
    stockLocationId: {
        type: String,
        autoform: {
            type: 'universe-select',
            afFieldInput: {
                uniPlaceholder: 'Select One',
                optionsMethod: 'pos.selectOptMethods.stockLocationMapping',
                optionsMethodParams: function () {
                    if (Meteor.isClient) {
                        let currentUserStockAndAccountMappingDoc = Session.get('currentUserStockAndAccountMappingDoc');
                        let stockLocations = [];
                        if (currentUserStockAndAccountMappingDoc && currentUserStockAndAccountMappingDoc.stockLocations) {
                            stockLocations = currentUserStockAndAccountMappingDoc.stockLocations;
                        }
                        let currentBranch = Session.get('currentBranch');
                        return {
                            branchId: currentBranch,
                            stockLocations: {
                                $in: stockLocations
                            }
                        };
                    }
                }
            }
        }
    },
    branchId: {
        type: String
    },
    status: {
        type: String,
        optional: true
    },
    invoiceType: {
        type: String,
        optional: true
    },
    saleId: {
        type: String,
        optional: true
    },
    closedAt: {
        type: Date,
        optional: true
    },
    saleType: {
        type: String,
        optional: true
    }
});

Meteor.startup(function () {
    Invoices.itemsSchema.i18n("pos.invoice.schema");
    Invoices.schema.i18n("pos.invoice.schema");
    Invoices.attachSchema(Invoices.schema);
});


export const InvoiceUpdateInfo_schema = new SimpleSchema({
    _id: {
        type: 'String',
    },
    deliveryDate: {
        type: Date,
        autoform: {
            afFieldInput: {
                type: "bootstrap-datetimepicker",
                dateTimePickerOptions: {
                    format: 'DD/MM/YYYY',

                }
            }
        },
        optional: true,
    },
    voucherId: {
        type: String,
        optional: true
    },
    dueDate: {
        type: Date,
        defaultValue: moment().toDate(),
        autoform: {
            afFieldInput: {
                type: "bootstrap-datetimepicker",
                dateTimePickerOptions: {
                    format: 'DD/MM/YYYY HH:mm:ss',

                }
            }
        }
    },
    customerId: {
        type: String,
        autoform: {
            type: 'select2',
            // afFieldInput: {
            //     uniPlaceholder: 'Please search .... (Limit 10)',
            //     optionsMethod: 'pos.selectOptMethods.customer',
            //     optionsMethodParams: function () {
            //         if (Meteor.isClient) {
            //             let currentBranch = Session.get('currentBranch');
            //             return {branchId: currentBranch};
            //         }
            //     }
            // }
        }
    },
    repId: {
        type: String,
        autoform: {
            type: 'universe-select',
            afFieldInput: {
                uniPlaceholder: 'Select One'
            }
        }
    },
    des: {
        type: String,
        optional: true,
        autoform: {
            afFieldInput: {
                type: 'textarea',
                rows: 5

            }
        }
    },
});
