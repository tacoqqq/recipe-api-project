



function filterListener(){

    $('.diet-type-option').click(event => {
        //When click on filter option, unselect the "No Preference" button.
        $('#diet-no-preference').prop('checked',false);

        //When all filter options are unchecked, the "No Preference" button is automaically back on. 
        let ifChecked = false;
        $('.diet-type-option').each(function(){
            if ($(this).prop('checked')){
                ifChecked = true;
            } 
        })
        if (!ifChecked) {
            $('#diet-no-preference').prop('checked',true);
        }
    })

    //when click on 'No Preference' button, unselect the rest checkboxes.
    $('#diet-no-preference').click(event => {
        $('.diet-type-option').prop('checked',false);
    });

    $('.health-concern-option').click(event => {
        //When click on filter option, unselect the "No Preference" button.
        $('#health-no-preference').prop('checked',false);

        //When all filter options are unchecked, the "No Preference" button is automaically back on. 
        let ifChecked = false;
        $('.health-concern-option').each(function(){
            if ($(this).prop('checked')){
                ifChecked = true;
            } 
        })
        if (!ifChecked) {
            $('#health-no-preference').prop('checked',true);
        }
    })

    //when click on 'No Preference' button, unselect the rest checkboxes.
    $('#health-no-preference').click(event => {
        $('.health-concern-option').prop('checked',false);
    });
}


$(filterListener);


