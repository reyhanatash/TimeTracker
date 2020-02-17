$(function () {
    $('#main-content #menu-user').on('click', function (event) {
        event.preventDefault();
        $('#menu-profile').fadeIn();
    });
    $('#menu-profile .btn-cancel').on('click', function (event) {
        event.preventDefault();
        $('#menu-profile').fadeOut();
    });
    if ($('.date').length > 0)
        $('.date').bootstrapMaterialDatePicker({weekStart: 0, time: false});
    if ($('.time').length > 0)
        $('.time').bootstrapMaterialDatePicker({date: false, shortTime: true, format: 'HH:MM'});

    /********/


    var $calendar = $('#calendar');
    var SDate = '';
    var EDate = '';
    var tdate = new Date();
    var dd = tdate.getDate(); //yields day
    var MM = tdate.getMonth(); //yields month
    var yyyy = tdate.getFullYear(); //yields year
    var today = new Date();
    if (TDate == 'undefined') {
        TDate = yyyy + '-' + MM + dd;
        SDate = yyyy + '-' + MM + '01';
        var lastDayOfMonth = new Date(yyyy, MM + 1, 0).getDate();
        EDate = yyyy + '-' + MM + lastDayOfMonth;
    }
    try {
        var SDate = SYear + '-' + SMonth + '-' + SDay;
        var EDate = EYear + '-' + EMonth + '-' + EDay;
    } catch (e) {

    }

    //alert(SDate + '  ' + EDate + ' ' + tdate);
    $calendar.fullCalendar({
        resourceAreaWidth: 230,

        now: TDate,
        editable: true,
        aspectRatio: 1.5,
        scrollTime: '00:00',
        defaultView: 'agendaWeek',
        selectable: true,
        validRange: {
            start: SDate,
            end: EDate
        },
        unselect: function (jsEvent, view) {
            alert(jsEvent)
            console.log(jsEvent)
        },
        eventSources: [
            {
                events: createEvents('source1'),
                color: 'green',
                id: 'source1'
            },
            {
                events: createEvents('source2'),
                color: 'blue',
                id: 'source2'
            }
        ]
    });

    function getRandomizer(bottom, top) {
        return Math.floor(Math.random() * (1 + top - bottom)) + bottom;
    }

    function createEvents(id) {
        return function (start, end, timezone, callback) {
            var date = getRandomizer(2, 8);
            var date2 = getRandomizer(2, 8);

            var events = [
                {
                    id: '0',
                    start: '2015-08-0' + (date + 1) + 'T02:00:00',
                    end: '2015-08-0' + (date + 1) + 'T0' + getRandomizer(4, 8) + ':00:00',
                    title: 'event A'
                },
                {
                    id: '1',
                    start: '2015-08-0' + (date - 1) + 'T02:00:00',
                    end: '2015-08-0' + (date - 1) + 'T0' + getRandomizer(4, 8) + ':00:00',
                    title: 'event B'
                },
                {
                    id: '2',
                    start: '2015-08-0' + date2 + 'T0' + getRandomizer(2, 6) + ':00:00',
                    end: '2015-08-0' + date2 + 'T22:00:00',
                    title: 'event C'
                },
                {id: '3', start: '2015-08-0' + date, end: '2015-08-0' + date, title: 'event D'},
                {
                    id: '4',
                    start: '2015-08-0' + date + 'T0' + getRandomizer(2, 6) + ':00:00',
                    end: '2015-08-0' + date + 'T08:00:00',
                    title: 'event E'
                },
                {
                    id: '5',
                    start: '2015-08-0' + date2 + 'T0' + getRandomizer(2, 6) + ':30:00',
                    end: '2015-08-0' + date2 + 'T0' + getRandomizer(3, 7) + ':30:00',
                    title: 'event F'
                },
                {
                    id: '6',
                    start: '2015-08-0' + date + 'T0' + getRandomizer(2, 6) + ':30:00',
                    end: '2015-08-0' + date + 'T0' + getRandomizer(3, 7) + ':30:00',
                    title: 'event G'
                }
            ];

            events = events.slice(0, getRandomizer(2, 6)); // randomize number of events

            callback(events);
        };
    }
});


// A $( document ).ready() block.

