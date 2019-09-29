function rndDate({date, min, max, type}) {
    let types = {};
    types.hour = 60 * 60 * 1000;
    types.day = 24 * types.hour,
    types.month = types.day * 30
    return new Date( date.valueOf() + (types[type] * rnd(min, max)) );
} 
