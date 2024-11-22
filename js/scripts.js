$(document).ready(function () {
    console.log('jQuery version:', $.fn.jquery);

    let trainSchedulesPCKL = [];
    let trainSchedulesKLPC = [];

    $.getJSON('assets/schedule_pc_kl.json', function (data) {
        trainSchedulesPCKL = data.schedules;
    }).fail(function (jqxhr, textStatus, error) {
        console.error('Error loading JSON:', textStatus, error);
    });

    $.getJSON('assets/schedule_kl_pc.json', function (data) {
        trainSchedulesKLPC = data.schedules;
    }).fail(function (jqxhr, textStatus, error) {
        console.error('Error loading JSON:', textStatus, error);
    });

    $('#getSchedulePCKL').click(function () {
        const now = new Date();
        const nextTrains = getNextTrains(now, trainSchedulesPCKL);
        displayTrainsPCKL(nextTrains);
    });

    $('#getScheduleKLPC').click(function () {
        const now = new Date();
        const nextTrains = getNextTrains(now, trainSchedulesKLPC);
        displayTrainsKLPC(nextTrains);
    });

    function getNextTrains(currentTime, schedules) {
        const upcomingTrains = schedules
            .map(schedule => {
                const departureTime = parseTime(schedule.departure);
                return { ...schedule, departureDate: departureTime };
            })
            .filter(schedule => schedule.departureDate > currentTime)
            .sort((a, b) => a.departureDate - b.departureDate);

        return upcomingTrains.slice(0, 3);
    }

    function parseTime(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const now = new Date();
        now.setHours(hours, minutes, 0, 0);
        if (now < new Date()) {
            now.setDate(now.getDate() + 1); // Handle times past midnight
        }
        return now;
    }

    function displayTrainsPCKL(trains) {
        if (trains.length === 0) {
            $('#trainInfoPCKL').html('<p>No upcoming trains today</p>');
            return;
        }

        let info = '';
        trains.forEach(train => {
            info += `<p>Departure: ${train.departure} — Arrival: ${train.arrival}</p>`;
        });
        $('#trainInfoPCKL').html(info);
    }

    function displayTrainsKLPC(trains) {
        if (trains.length === 0) {
            $('#trainInfoKLPC').html('<p>No upcoming trains today</p>');
            return;
        }

        let info = '';
        trains.forEach(train => {
            info += `<p>Departure: ${train.departure} — Arrival: ${train.arrival}</p>`;
        });
        $('#trainInfoKLPC').html(info);
    }

});
