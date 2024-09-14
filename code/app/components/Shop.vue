<template>
    <Page>
        <ActionBar @loaded="pageLoaded">
            <Button @tap="back" width="25%" horizontalAlignment="left">Back
            </Button>
        </ActionBar>
        <ScrollView>

            <StackLayout orientation="vertical">
                <FlexboxLayout width="100%" justifyContent="space-between"
                    padding="5" fontSize="15px">
                    <Label>Coin: </Label>
                    <Label>{{coin}}</Label>
                </FlexboxLayout>

                <FlexboxLayout v-for="(upgrade,Index) in upgrades"
                    flexDirection="row" backgroundColor="yellow">
                    <StackLayout padding="5">
                        <Label>{{upgrade.name}}</Label>
                        <TextView height="*" editable="false">{{upgrade.des}}
                        </TextView>
                    </StackLayout>
                    <Button :isEnabled="!upgrade.enabled" height="*"
                        @tap="buy(Index)" v-if="load">
                        Cost: {{upgrade.cost}}
                    </Button>
                </FlexboxLayout>

            </StackLayout>
        </ScrollView>

    </Page>
</template>

<script>
    import * as upgradeList from "./common/upgrade";
    import * as setting from "./common/setting";
    const fileSystemModule = require("tns-core-modules/file-system");

    export default {
        methods: {
            back() {
                this.$navigateBack();
            },
            async buy(index) {
                var data = await setting.getData();
                if (data.coin >= this.upgrades[index].cost) {
                    data.coin -= this.upgrades[index].cost;
                    this.coin = data.coin;

                    for (var i = 0; i < data.upgrade.length; i++) {
                        if (data.upgrade[i].id == this.upgrades[index]
                            .id) {
                            data.upgrade[i].enabled = true;
                            this.upgrades[index].enabled = true;
                            break;
                        }
                    }
                    console.log("data.coin:" + data.coin);
                    await setting.setData(data);
                } else {
                    alert("Your coins are not enough.");
                }
            },
            async pageLoaded() {
                console.log("pageLoaded()");
                this.load = false;
                await setting.checkSetting();
                var data = await setting.getData();
                console.log(data);
                this.coin = data.coin;

                this.upgrades = upgradeList.upgrades;
                console.log("start");
                for (var j = 0; j < this.upgrades.length; j++) {
                            this.upgrades[j].enabled = false;
                }
                for (var i = 0; i < data.upgrade.length; i++) {
                    console.log("loop" + i);
                    if (data.upgrade[i].enabled) {
                        for (var j = 0; j < this.upgrades.length; j++) {
                            if (!this.upgrades[j].enabled) {
                                if (this.upgrades[j].id == data.upgrade[i]
                                    .id) {
                                    console.log("buy");
                                    this.upgrades[j].enabled = true;
                                    break;
                                } else {
                                    console.log("notbuy");
                                    
                                }
                            }
                        }
                    }
                }
                console.log(upgradeList.upgrades.length);
                this.load = true;
                console.log(this.load);
                console.log("upgrade.enabled" + this.upgrades[0].enabled);
            }
        },

        data() {
            return {
                upgrades: null,
                load: false,
                coin: 0
            };
        }
    };
</script>

<style>
</style>