define([
    'react'
], function(React) {
    return {
        TYPE_LESS: 0,
        TYPE_MORE: 1,

        check: function( /*Date*/ date, type) {
            if (date.getDay() == 0) {
                switch (type) {
                    case this.TYPE_MORE:
                        date.setDate(date.getDate() + 1);
                        break;
                    case this.TYPE_LESS:
                        date.setDate(date.getDate() - 2);
                        break;
                }
            } else if (date.getDay() == 6) {
                switch (type) {
                    case this.TYPE_MORE:
                        date.setDate(date.getDate() + 2);
                        break;
                    case this.TYPE_LESS:
                        date.setDate(date.getDate() - 1);
                        break;
                }
            }

            return date;
        }
    }
});