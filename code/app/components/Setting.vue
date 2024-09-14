<template>
    <Page>
        <ActionBar>
            <Button @tap="back" width="25%" horizontalAlignment="left">Back
            </Button>
        </ActionBar>
        <StackLayout>
            <StackLayout width="80%" borderColor="grey" borderWidth="2"
                padding="10" margin="5" height="auto">
                <label>Game Background Music</label>
                <FlexboxLayout orientation="horizontal" height="25%"
                    justifyContent="center" width="100%">
                    <Button class="settingBtnBG"
                        v-bind:class="{ 'btnEnable': sound }"
                        backgroundImage="~/assets/speaker.png" width="48%"
                        height="100%" @tap="toggleSound()" />
                    <Button class="settingBtnBG"
                        v-bind:class="{ 'btnEnable': !sound }"
                        backgroundImage="~/assets/speaker-off.png" width="48%"
                        height="100%" @tap="toggleSound()" />
                </FlexboxLayout>
            </StackLayout>
            <!--<StackLayout width="80%" borderColor="grey" borderWidth="2"
                padding="10" margin="5" height="auto">
                <label>Control</label>
                <FlexboxLayout orientation="horizontal" height="25%"
                    justifyContent="center" width="100%">
                    <Button width="48%" height="100%" />
                    <Button width="48%" height="100%" />
                </FlexboxLayout>
            </StackLayout>-->
            <StackLayout width="80%" borderColor="grey" borderWidth="2"
                margin="5">
                <Button width="100%" text="Reset Process" @tap="reset" />
            </StackLayout>
        </StackLayout>
    </Page>
</template>

<script>
    import * as setting from "./common/setting";
    export default {
        data() {
            return {
                sound: false,
                control: false
            };
        },
        methods: {
            back() {
                this.$navigateBack();
            },
            async reset() {
                await setting
                    .reset()
                    .then(() => {
                        alert("The game process is resetted");
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            async toggleSound(btn) {
                this.sound = this.sound ? false : true;
                var data = await setting.getData();
                data.sound = this.sound;
                await setting.setData(data);
                console.log("currentSound:" + this.sound);
            }
        },
        async mounted() {
            var data = await setting.getData();
            if (data.sound) {
                this.sound = true;
            }
            console.log("systemSound:" + data.sound);
            console.log("setSound:" + this.sound);
            /*if (data.control) {
                        this.control = true;
                    }*/
        }
    };
</script>

<style>
    .settingBtnBG {
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        background-color: #A3A3A3;
    }

    .btnEnable {
        background-color: #e3e3e3;
    }
</style>