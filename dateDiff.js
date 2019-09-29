function dateDiff(date1, date2, type = "day") {
    let types = {};
    const delta = date2 - date1;
    types.hour = 60 * 60 * 1000;
    types.day = 24 * types.hour,
    types.month = types.day * 30
    if (!type in types) type = "day";
    return delta / types[type];
}  
