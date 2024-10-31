 for(let i=0; i<this.eventDataSource.data.length; i++){
      const date = new Date(this.eventDataSource.data[i].date);
      const weekday = date.getDay();
      const shouldFilter =
      ( date < startDate) ||
      ( date > endDate) ||
      (!jours.lundi && weekday === 1)||
      (!jours.mardi && weekday === 2)||
      (!jours.mercredi && weekday === 3)||
      (!jours.jeudi && weekday === 4)||
      (!jours.vendredi && weekday === 5)||
      (!jours.samedi && weekday === 6)||
      (!jours.dimanche && weekday === 0);
      if(shouldFilter){
        this.eventDataSource.data.filter;
      }

      
    }