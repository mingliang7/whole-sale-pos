import {Meteor} from 'meteor/meteor';
import {Templet} from 'meteor/templating';
import {Tabular} from 'meteor/aldeed:tabular';
import {EJSON} from 'meteor/ejson';
import {moment} from 'meteor/momentjs:moment';
import {_} from 'meteor/erasaur:meteor-lodash';
import {numeral} from 'meteor/numeral:numeral';
import {lightbox} from 'meteor/theara:lightbox-helpers';

// Lib
import {tabularOpts} from '../../../core/common/libs/tabular-opts.js';

// Collection
import {Item} from '../../imports/api/collections/item.js';

// Page
Meteor.isClient && require('../../imports/ui/pages/item.html');

tabularOpts.name = 'pos.item';
tabularOpts.collection = Item;
tabularOpts.columns = [
    {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.Pos_itemAction},
    {data: "_id", title: "ID"},
    {data: "name", title: "Name"},
    {data: "_unit.name", title: "Unit"},
    {
        data: "price",
        title: "Retail Price",
        render: function (val, type, doc) {
            return numeral(val).format('$ 0,0.000');
        }
    },{
        data: "wholeSalePrice",
        title: "WholeSale Price",
        render: function (val, type, doc) {
            return numeral(val).format('$ 0,0.000');
        }
    },{
        data: "purchasePrice",
        title: "Purchase Price",
        render: function (val, type, doc) {
            return numeral(val).format('$ 0,0.000');
        }
    },
    {
        data: "photo",
        title: "Photo",
        render: function (val, type, doc) {
            if (val) {
                let img = Files.findOne(val);
                if (img) {
                    return lightbox(img.url(), doc._id, doc.name);
                }
            }

            return null;
        }
    }
];
tabularOpts.extraFields = ['mappingEnable','sellingUnit', 'scheme', 'unitId', 'categoryId', 'itemType','purchasePrice'];
export const ItemTabular = new Tabular.Table(tabularOpts);