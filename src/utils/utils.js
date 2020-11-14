

export default {

  formatDateString(value) {

      const formattedValue = new Date(value);

      const dateValue = formattedValue.toLocaleDateString() + " " + formattedValue.toLocaleTimeString();

      return dateValue;

  },formatNumber(num) {

      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
       
  }

};
