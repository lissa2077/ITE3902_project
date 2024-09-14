<template>
    <Page>
        <ActionBar @loaded="pageLoaded">
            <Button @tap="back" width="25%" horizontalAlignment="left">Back
            </Button>
        </ActionBar>

        <ScrollView>
            <StackLayout>
                <GridLayout rows="*" height="1000px" borderColor="grey"
                    borderWidth="2">
                    <RadCartesianChart row="0" style="font-size: 12;">
                        <LineSeries v-tkCartesianSeries
                            :items="categoricalSource" categoryProperty="Time"
                            valueProperty="CoinsEarn" />
                        <CategoricalAxis v-tkCartesianHorizontalAxis />
                        <LinearAxis v-tkCartesianVerticalAxis />
                    </RadCartesianChart>
                </GridLayout>

                <StackLayout borderColor="grey" borderWidth="2" padding="5"
                    marginTop="10">
                    <Label style="text-decoration: underline;font-size:20px">Top 3</Label>
                    <Label v-for="record in top">Date: {{record.Date}}, {{record.CoinsEarn}} Coins, Complete {{record.OrderCompleted}} Order
                    </Label>
                </StackLayout>
                <!--<GridLayout rows="*,*,*" cols="auto,auto,auto"
                    width="100%" borderColor="red" borderWidth="3">
                    <Label row="0" col="0" width="100%">CoinsEarn</Label>
                    <Label row="0" col="1" width="100%">OrderCompleted</Label>
                    <Label row="0" col="2" width="100%">Date</Label>

                    <Label :row="(Index+1)" col="0"
                        v-for="(record,Index) in top">
                        {{record.CoinsEarn}}</Label>
                    <Label :row="(Index+1)" col="1"
                        v-for="(record,Index) in top">
                        {{record.OrderCompleted}}</Label>
                    <Label :row="(Index+1)" col="2"
                        v-for="(record,Index) in top">{{record.Date}}
                    </Label>

                </GridLayout>-->
            </StackLayout>
        </ScrollView>
    </Page>
</template>

<script>
    import Vue from "nativescript-vue";
    import RadCartesianChart from "nativescript-ui-chart/vue";
    Vue.use(RadCartesianChart);

    const fileSystemModule = require("tns-core-modules/file-system");
    import * as setting from "./common/setting";

    export default {
        data() {
            return {
                categoricalSource: null,
                top: null
            };
        },
        methods: {
            back() {
                this.$navigateBack();
            },
            check() {
                console.log(this.top.length);
            },
            topThree() {
                console.log("topThree()");
                this.top = JSON.parse(JSON.stringify(this.categoricalSource));
                this.top.sort(
                    (a, b) =>
                    a.CoinsEarn < b.CoinsEarn ?
                    1 :
                    b.CoinsEarn < a.CoinsEarn ?
                    -1 :
                    0
                );
                if (this.top.length > 3) {
                    this.top = this.top.splice(0, 3);
                }
                console.log(this.top);
            }
        },
        async mounted() {
            console.log("pageLoaded()");
            await setting.checkSetting();
            var data = await setting.getData();
            this.categoricalSource = data.record;
            this.load = true;
            this.topThree();
        }
    };
</script>

<style>
</style>