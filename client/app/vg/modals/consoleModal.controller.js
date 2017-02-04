'use strict';
/*jshint camelcase: false */

angular.module('portfolioApp').controller('ConsolesDialogCtrl', ['con', '$mdDialog', 'mods',
  function (con, $mdDialog, mods) {
    var cd = this,
      screenHeight = window.innerHeight,
      screenWidth = window.innerWidth;

    cd.height = (screenHeight - 20) + 'px';
    cd.width = (screenWidth > 1280 ? 1000 : screenWidth - 20) + 'px';

    cd.conProps = {
      name: con.name,
      price: con.original_price,
      date: moment(con.release_date).format('MM/DD/YYYY'),
      desc: con.deck,
      company: con.company.name,
      aliases: con.aliases === null ? false : con.aliases,
      online: con.online_support ? 'Yes' : 'No',
      image: con.image.small_url,
      mods: mods
    };

    cd.closeDialog = function () {
      $mdDialog.hide();
    };
  }
]);
