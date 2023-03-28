
/*<subreddit>:{
    reps:[<representativeID1>,<representativeID2>,<representativeID3>],
    template:"./templates/<subreddit>.png " //without the r/ prefix
    }
    */
function readsubs(filelocation){

    const fileName = filelocation;
    fs.readFile(fileName, 'utf8', (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      else{
        return JSON.parse(data);
      }
    });
}

function writesubs(filelocation){
    const fileName = filelocation;
    fs.writeFile(fileName, JSON.stringify(settings), (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Settings saved!");
    });
}
function addsub(subs,sub,template){
    subs[sub].push({"reps":[],"template":template});
}
function addrep(subs,sub,rep){
    subs[sub].reps.push(rep);  
}