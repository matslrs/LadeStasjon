function sidebarLayersListeners() {

	//list of layers items:
    $('.list-group.checked-list-box .list-group-item').each(function () {    
        // Settings
        var $listItem = $(this);
        setupCheckedBoxSettings($listItem);


        // Event Handler
        $listItem.on('click', function () {
            var isChecked = $listItem.data('checked');

            layer = overlayMaps[$listItem.attr('id')];
            if(!isChecked){
                Map.addLayer(layer);
                // mymap.addLayer(layer);
                // layer.bringToFront();
                //layer.addTo(mymap);
            } else{
                Map.removeLayer(layer);
                //layer.removeFrom(mymap);
                //mymap.removeLayer(layer);
            }

            var oppositeChecked = !$listItem.data('checked');
            $listItem.data( "checked", oppositeChecked );
            updateCheckedDisplay($listItem);

            console.log("my Id: " + $listItem.attr('id'));

        });

    });
	    
}

function setupCheckedBoxSettings(self){

	 settings = {
        on: {
            icon: 'glyphicon glyphicon-check'
        },
        off: {
            icon: 'glyphicon glyphicon-unchecked'
        }
    };

    self.data( "settings", settings );
    self.data( "checked", false );
    self.css('cursor', 'pointer');

}

function updateCheckedDisplay(self) {
   var isChecked = self.data('checked');

    // Set the button's state
    self.data('state', (isChecked) ? "on" : "off");

    // Set the button's icon
    self.find('.state-icon')
        .removeClass()
        .addClass('state-icon ' + self.data( "settings")[self.data('state')].icon + ' pull-right');
}
