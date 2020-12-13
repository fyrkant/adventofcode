const data = `29,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,37,x,x,x,x,x,409,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,17,13,19,x,x,x,23,x,x,x,x,x,x,x,353,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,41`;
const parseLine = (input)=>{
    return parseInt(input, 10);
};
const getBuses = (input)=>{
    const arr = input.split(",");
    const ret = [];
    for(let index = 0; index < arr.length; index++){
        const id = arr[index];
        if (id !== "x") {
            const x = [
                parseInt(id, 10),
                index
            ];
            ret.push(x);
        }
    }
    return ret;
};
const allMatch = (timestamp, buses)=>{
    for(let index = 0; index < buses.length; index++){
        const [id, offset] = buses[index];
        if ((timestamp + offset) % id !== 0) {
            return false;
        }
    }
    return true;
};
const doFindEarliest = (input)=>{
    const d = getBuses(input);
    const first = d[0][0];
    const start = d.reduce((p, [num, offset])=>{
        return p * (num - offset);
    }, 1);
    console.log({
        first
    });
    let x = 0;
    for(let index = first; !allMatch(index, d); index = index + first){
        x = index;
    }
    const result = x + first;
    console.log({
        result
    });
    return result;
};
const x = doFindEarliest(data);
console.log(x);
