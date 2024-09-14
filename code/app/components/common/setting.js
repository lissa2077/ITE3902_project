export const setting = {
    coin: 600,
    record: [],
    sound: false,
    control: false,
    upgrade: [
        { id: 1, name: "timeIncrease", enabled: false },
        { id: 2, name: "coinIncrease", enabled: false }

    ]
}

export const record = {
    Time: "-1",
    CoinsEarn: 0,
    OrderCompleted: 0,
    Date: "1970-01-01"
}
const fileSystemModule = require("tns-core-modules/file-system");

export async function checkSetting() {
    console.log('checkSetting');
    const documents = fileSystemModule.knownFolders
        .documents();
    var file = documents.getFile("data");
    if (!fileSystemModule.File.exists(documents.path +
        "/data")) {
        console.log('start reset');
        await reset();
    } else {
        var text = await file.readText();
        if (text == "") {
            console.log('emptyfile,start reset');
            await reset();
        }
    }

}

export async function saveRecord(earnCoin, orderCompleted, date) {
    console.log("save:" + earnCoin + "|" + orderCompleted + "|" + date + "|");
    const documents = fileSystemModule.knownFolders
        .documents();
    var file = documents.getFile("data");
    checkSetting();
    var text = await file.readText();
    var data = JSON.parse(text);

    data.coin += earnCoin;
    var setRecord = record;
    setRecord.Time = data.record.length + 1 + "";
    setRecord.CoinsEarn = earnCoin;
    setRecord.OrderCompleted = orderCompleted;
    setRecord.Date = date;
    console.log(setRecord);
    data.record.push(setRecord);
    console.log("text string", JSON.stringify(data));
    await file
        .writeText(JSON.stringify(data))
        .then(async () => {
            console.log("Add Record Sucess");
            console.log(
                "The file exist:" +
                fileSystemModule.File.exists(
                    documents.path +
                    "/Test_Write.txt"
                )
            );
        })
        .catch(err => {
            console.log(err.stack);
        });
}

export async function reset() {

    console.log("reset");
    const documents = fileSystemModule.knownFolders.documents();
    var file = documents.getFile("data");
    var data = setting;
    console.log("data:"+data);
    await file
        .writeText(JSON.stringify(data))
        .then(async () => {
            console.log("Reset Sucess");
            console.log(
                "The file exist:" +
                fileSystemModule.File.exists(
                    documents.path +
                    "/Test_Write.txt"
                )
            );
        });
}

export async function getData() {
    const documents = fileSystemModule.knownFolders.documents();
    var file = documents.getFile("data");
    var text = await file.readText();
    console.log("text:" + text);
    var data = JSON.parse(text);
    return data;
}

export async function setData(data) {
    const documents = fileSystemModule.knownFolders.documents();
    var file = documents.getFile("data");
    await file
        .writeText(JSON.stringify(data))
        .then(async () => {
            console.log("Write Sucess");
            console.log(
                "The file exist:" +
                fileSystemModule.File.exists(
                    documents.path +
                    "/Test_Write.txt"
                )
            );
        })
        .catch(err => {
            console.log(err.stack);
        });
}



