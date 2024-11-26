$(document).ready(function () {
    console.log('jQuery version:', $.fn.jquery);
  
    let trainSchedulesPCKL = [];
    let trainSchedulesKLPC = [];
  
    // Load schedules for PC - KL
    $.getJSON('assets/schedule_pc_kl.json', function (data) {
      trainSchedulesPCKL = data.schedules;
    }).fail(function (jqxhr, textStatus, error) {
      console.error('Error loading JSON:', textStatus, error);
    });
  
    // Load schedules for KL - PC
    $.getJSON('assets/schedule_kl_pc.json', function (data) {
      trainSchedulesKLPC = data.schedules;
    }).fail(function (jqxhr, textStatus, error) {
      console.error('Error loading JSON:', textStatus, error);
    });
  
    // Event handler for PC - KL button
    $('#getSchedulePCKL').click(function () {
      const now = new Date();
      const nextTrains = getNextTrains(now, trainSchedulesPCKL);
      displayTrains('PCKL', nextTrains);
    });
  
    // Event handler for KL - PC button
    $('#getScheduleKLPC').click(function () {
      const now = new Date();
      const nextTrains = getNextTrains(now, trainSchedulesKLPC);
      displayTrains('KLPC', nextTrains);
    });
  
    function getNextTrains(currentTime, schedules) {
      const upcomingTrains = schedules
        .map(schedule => {
          const departureTime = parseTime(schedule.departure);
          return { ...schedule, departureDate: departureTime };
        })
        .filter(schedule => schedule.departureDate > currentTime)
        .sort((a, b) => a.departureDate - b.departureDate);
  
      return upcomingTrains.slice(0, 5);
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
  
    function displayTrains(direction, trains) {
      const trainInfoId = direction === 'PCKL' ? '#trainInfoPCKL' : '#trainInfoKLPC';
  
      if (trains.length === 0) {
        $(trainInfoId).html('<p>No upcoming trains today</p>');
        return;
      }
  
      let info = '';
      trains.forEach(train => {
        info += `
          <p class="train-schedule">
            <a href="#" class="train-link link-underline link-underline-opacity-0 text-white" data-departure="${train.departure}" data-arrival="${train.arrival}">
              Departure: ${train.departure} — Arrival: ${train.arrival}
            </a>
          </p>
        `;
      });
      $(trainInfoId).html(info);
    }
  
    // Event listener for train links (both directions)
    $('.card-body').on('click', '.train-link', function (event) {
      event.preventDefault(); // Prevent default link behavior
      const departure = $(this).data('departure');
      const arrival = $(this).data('arrival');
      shareSchedule(departure, arrival);
    });
  
    function shareSchedule(departure, arrival) {
      if (navigator.share) {
        navigator.share({
          title: 'Train Schedule',
          text: `Departure: ${departure}, Arrival: ${arrival}`,
          // Optionally include a URL
          // url: window.location.href
        })
          .then(() => console.log('Successful share'))
          .catch((error) => console.error('Error sharing', error));
      } else {
        alert('Web Share API is not supported in your browser.');
      }
    }
  });
  