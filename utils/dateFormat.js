const dateFormat = (date) => {

    let newDate = date;

    if (!date) {
        newDate = new Date();
    }

    const month = newDate.getMonth() + 1;
    const day = newDate.getDate();
    const year = newDate.getFullYear();

    return `${month}/${day}/${year}`;
}

module.exports = dateFormat;