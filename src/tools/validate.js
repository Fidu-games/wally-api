exports.evalRecivedData = (recived, ...expected) => {
    let evaluated = [], ok = false;

    if(recived != null && Object.keys(recived).length > 0){
        evaluated = expected.map( current => {
            return !Object.keys(recived).some(key => {
                return key == current && recived[key] != null && recived[key] != "";
            }) ? current : null;
        });
        ok = evaluated.every(v => v == null);
    }

    return {
        evaluated: evaluated.filter(m => m != null),
        ok: ok
    };
}