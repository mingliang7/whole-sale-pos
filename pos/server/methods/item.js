import {Item} from '../../imports/api/collections/item';

Meteor.methods({
    findItemName(id) {
        return Item.findOne(id);
    },
    checkItemPriceType(selector) { //check if price is whole sale or retail
        return Item.find(selector).fetch();
    },
    lookupItemsArr(arr){
        let itemIds = [];
        arr.forEach(function(item){
            itemIds.push(item.itemId);
        })
        return Item.find({_id: {$in: itemIds}}).fetch();
    }
});