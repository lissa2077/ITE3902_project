<template>
    <Page>
        <ActionBar @loaded="pageLoaded">
            <WrapLayout>
                <Button width="15%" @tap="pause" class="btnIcon"
                    backgroundImage="~/assets/pause-button.png" />
                <Progress width="70%" :value="time" :maxValue="waitTime" />
            </WrapLayout>
        </ActionBar>
        <StackLayout orientation="vertical" backgroundColor="lightgray">
            <StackLayout row="0" col="0" orientation="vertical"
                backgroundColor="lightgray" height="30%" margin="5"
                padding="5" borderColor="black" borderWidth="2">
                <Label v-if="load">Order {{orderCount+1}}-{{order.length}}item</Label>
                <FlexboxLayout orientation="horizontal"
                    justifyContent="center">
                    <Image width="24%" :src="orderItem.src"
                        v-for="orderItem in order"
                        v-bind:class="{ 'submit': orderItem.submit }"
                        v-if="orderload" />
                </FlexboxLayout>
            </StackLayout>
            <StackLayout height="70%">
                <GridLayout row="2" col="0" columns="*,*" rows="*,*,*"
                    backgroundColor="#2F4F4F" width="100%" height="75%">
                    <template v-if="load">
                        <Button class="btnBG"
                            v-bind:class="{ 'btnBG-click': item.choose }"
                            width="100%" height="100%" :row="item.row"
                            :col="item.col" :backgroundImage="item.src"
                            @tap="clickItem(index)"
                            v-for="(item,index) in items" />
                    </template>
                    <!--<Button class="btnBG" width="100%" height="100%" row="0"
                        col="0" backgroundColor="#2F4F4F"
                        v-if="items[0] != null"
                        :backgroundImage="items[0].src" />
                    <Button class="btnBG" width="100%" height="100%" row="0"
                        col="1" backgroundColor="#2F4F4F"
                        v-if="items[1] != null"
                        :backgroundImage="items[1].src" />
                    <Button class="btnBG" width="100%" height="100%" row="1"
                        col="0" backgroundColor="#2F4F4F"
                        v-if="items[2] != null"
                        :backgroundImage="items[2].src" />
                    <Button class="btnBG" width="100%" height="100%" row="1"
                        col="1" backgroundColor="#2F4F4F"
                        v-if="items[3] != null"
                        :backgroundImage="items[3].src" />
                    <Button class="btnBG" width="100%" height="100%" row="2"
                        col="0" backgroundColor="#2F4F4F"
                        v-if="items[4] != null"
                        :backgroundImage="items[4].src" />
                    <Button class="btnBG" width="100%" height="100%" row="2"
                        col="1" backgroundColor="#2F4F4F"
                        v-if="items[5] != null"
                        :backgroundImage="items[5].src" />-->
                </GridLayout>
                <WrapLayout orientation=" horizontal" backgroundColor="black"
                    row="3" col="0" height="25%">
                    <Button width="20%" height="100%" margin="0" @tap="clear"
                        backgroundImage="~/assets/trash-can.png"
                        class="btnIcon">
                    </Button>
                    <Button width=" 60%" height="100%" margin="0"
                        @tap="submit" :isEnabled="!btnSubmit"
                        style="font-size:30px;text-weight:bold">Submit
                    </Button>
                    <Button width="20%" height="100%" margin="0"
                        @tap="refresh"
                        backgroundImage="~/assets/anticlockwise-rotation.png"
                        class="btnIcon">
                    </Button>
                </WrapLayout>
            </StackLayout>
            <!--<AbsoluteLayout ref="screen" width="100%" height="70%"
                @layoutChanged="processLayout" backgroundColor="blue"
                padding="-5">
                <Button :left="product.x-5" :top="product.y"
                    :width="totalWidth*0.5" :height="totalHeight*0.24"
                    v-for="product in item"/> 
                <Button :left="btn.x" :top="btn.y"
                    :width="totalWidth*0.25" :height="totalHeight*0.25"
                    v-for="btn in bottom" margin="0" />
                <Button :left="bag.x" :top="bag.y" :width="totalWidth*0.5"
                    :height="totalHeight*0.25" backgroundColor="green"
                    v-if="bag != null" margin="0" />
                <WrapLayout left="0" :top="totalHeight*0.75" width="100%"
                    :height="totalHeight*0.25" orientation="horizontal"
                    backgroundColor="black">
                    <Button width="15%" height="100%">Pause</Button>
                    <Button width="60%" height="100%">Submit</Button>
                </WrapLayout>
            </AbsoluteLayout>-->

        </StackLayout>
    </Page>
</template>

<script>
    import Main from "./Main";
    import * as utils from "tns-core-modules/utils/utils";
    const deviceOrientation = require("../nativescript-screen-orientation");
    import * as productsList from "./common/product";
    import * as setting from "./common/setting";
    const fileSystemModule = require("tns-core-modules/file-system");
    const {
        TNSPlayer
    } = require("../nativescript-audio");

    export default {
        data() {
            return {
                timer: "",
                time: 80,
                waitTime: 80,
                totalWidth: 0,
                totalHeight: 0,
                items: [{
                        row: 0,
                        col: 0,
                        choose: false
                    },
                    {
                        row: 0,
                        col: 1,
                        choose: false
                    },
                    {
                        row: 1,
                        col: 0,
                        choose: false
                    },
                    {
                        row: 1,
                        col: 1,
                        choose: false
                    },
                    {
                        row: 2,
                        col: 0,
                        choose: false
                    },
                    {
                        row: 2,
                        col: 1,
                        choose: false
                    }
                ],
                products: null,
                load: false,
                order: [],
                orderload: false,
                orderCount: 0,
                earn: 0,
                timeIncrease: false,
                coinIncrease: false,
                btnSubmit: false,
                _player: null
            };
        },
        async mounted() {
            console.log("Start Game");
            await setting.checkSetting();
            this.timer = setInterval(() => {
                this.time--; //console.log(this.time);
                if (this.time < 0) {
                    console.log("Game Over");
                    this.gameover();
                }
            }, 1000);
            console.log("run end");
        },
        methods: {
            async loadSetting() {

                var data = await setting.getData();

                if (data.sound) {
                    this._player = new TNSPlayer();

                    const playerOptions = {
                        audioFile: "https://www.fesliyanstudios.com/musicfiles/2018-11-27_-_Happy_Tree_-_FesliyanStudios.com_By_Stephen_Bennett.mp3",
                        loop: true,
                        autoplay: true
                    };

                    await this._player
                        .initFromUrl(playerOptions)
                        .then(res => {
                            console.log(res);
                        })
                        .catch(err => {
                            console.log("something went wrong...",
                                err);
                        });
                }

                for (var i = 0; i < data.upgrade.length; i++) {
                    if (data.upgrade[i].enabled) {
                        switch (data.upgrade[i].id) {
                            case 1:
                                this.timeIncrease = true;
                                break;
                            case 2:
                                this.coinIncrease = true;
                                break;
                        }
                    }
                }
            },
            async pageLoaded() {
                console.log("pageLoaded");

                this.loadSetting();
                this.products = productsList.products;
                this.createOrder();
                this.refresh();
            },
            clickItem(index) {
                this.items[index].choose = this.items[index].choose ? false :
                    true;
            },
            async submit() {
                this.btnSubmit = true;
                var isSubmit = false;
                this.orderload = false;
                for (var i = 0; i < this.items.length; i++) {
                    if (this.items[i].choose) {
                        if (this.items[i].id < 0) {
                            this.items[i].choose = false;
                            continue;
                        }
                        for (var j = 0; j < this.order.length; j++) {
                            if (!this.order[j].submit) {
                                console.log(
                                    this.order[j].id == this.items[i]
                                    .id,
                                    this.order[j].id + "|" + this
                                    .items[i].id
                                );
                                if (this.order[j].id == this.items[i]
                                    .id) {
                                    this.order[j].submit = true;
                                    isSubmit = true;
                                    this.items[i].choose = false;
                                    this.items[i].id = -1;
                                    this.items[i].src = "";
                                    break;
                                }
                            }
                        }
                        if (!isSubmit) {
                            console.log(this.items[i].id + "||Game Over");
                            this.gameover();
                            break;
                        }
                        isSubmit = false;
                    }
                }
                await this.checkOrder();
                this.orderload = true;
                this.btnSubmit = false;
            },
            refresh() {
                this.load = false;
                for (var i = 0; i < 6; i++) {
                    var num = parseInt(Math.random() * this.products.length);
                    this.items[i].id = this.products[num].id;
                    this.items[i].src = this.products[num].src;
                    this.items[i].choose = false;
                }
                this.load = true;
            },
            createOrder() {
                this.orderload = false;
                this.order = [];
                var count = parseInt(Math.random() * 5);
                if (count == 0) {
                    count = 1;
                }
                for (var i = 1; i <= count; i++) {
                    var num = parseInt(Math.random() * this.products.length);
                    if (num == 0) {
                        num = 1;
                    }
                    var orderItem = {};
                    orderItem.id = this.products[num].id;
                    orderItem.src = this.products[num].src;
                    orderItem.submit = false;
                    this.order.push(orderItem);
                }
                if (this.coinIncrease) {
                    this.waitTime = count * 7;
                } else {
                    this.waitTime = parseInt(count * 5);
                }
                this.time = this.waitTime;
                this.orderload = true;
                console.log("Order length:" + this.order.length);
            },
            async checkOrder() {
                for (var i = 0; i < this.order.length; i++) {
                    console.log(this.order[i].submit);
                    if (!this.order[i].submit) {
                        console.log("not complete");
                        return;
                    }
                }
                this.orderCount++;
                switch (this.order.length) {
                    case 1:
                        this.earn += 5;
                        break;
                    case 2:
                        this.earn += 12;
                        break;
                    case 3:
                        this.earn += 21;
                        break;
                    case 4:
                        this.earn += 32;
                        break;
                }
                if (this.coinIncrease) {
                    this.earn += 6;
                }
                await this.createOrder();
            },
            clear() {
                for (var i = 0; i < this.items.length; i++) {
                    this.items[i].choose = false;
                }
            },
            async gameover() {
                clearInterval(this.timer);

                alert({
                    title: "Game Over",
                    message: "You complete " +
                        this.orderCount +
                        " order! \nYou earn " +
                        this.earn +
                        " coins!",
                    okButtonText: "Back To Main"
                }).then(async () => {
                    console.log("Alert dialog closed ");
                    var date = new Date();
                    var playDate =
                        date.getFullYear() +
                        "-" +
                        (date.getMonth() + 1) +
                        "-" +
                        (date.getDate() + 1);
                    await setting
                        .saveRecord(this.earn, this
                            .orderCount, playDate)
                        .then(() => {
                            this.$navigateBack();
                        });
                });
            },
            pause() {
                clearInterval(this.timer);
                confirm({
                    title: "Pause",
                    message: "Total complete order: " +
                        this.orderCount +
                        "\nTime Increase: " +
                        this.timeIncrease +
                        "\nCoin Increase: " +
                        this.coinIncrease,
                    okButtonText: "Continue",
                    cancelButtonText: "Back To Main Screen  "
                }).then(result => {
                    if (result) {
                        this.timer = setInterval(() => {
                            this
                                .time--; //console.log(this.time);
                            if (this.time < 0) {
                                console.log("Game Over");
                                this.gameover();
                            }
                        }, 1000);
                    } else {
                        this.gameover();
                    }
                });
            }
        },
        beforeDestroy() {
            if (this.timer) {
                clearInterval(this.timer);
            }
            if (this._player != null) {
                if (this._player.isAudioPlaying()) {
                    this._player.pause();
                }
            }
        }
    };
</script>

<style>
    .btnBG {
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        background-color: #2F4F4F;
    }

    .btnBG-click {
        background-color: green;
    }

    .btnIcon {
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
    }

    .submit {
        background-image: url("~/assets/check-mark.png");
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
    }
</style>