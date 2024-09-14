<template>
    <Page actionBarHidden="true">
        <GridLayout columns="*" rows="auto, *"
            backgroundImage="~/assets/bg.png">


            <Button class="cogBtnBG" backgroundImage="~/assets/cog.png"
                row="0" col="0" @tap="goToSetting"
                horizontalAlignment="right" />

            <FlexboxLayout flexDirection="column" row="1" col="0"
                justifyContent="center">
                <Label class="logo">Fast-Food Shop</Label>
                <Button text="Start" @tap="startGame" />
                <Button text="Shop" @tap="goToShop" />
                <Button text="Record" @tap="goToRecord" />
            </FlexboxLayout>
        </GridLayout>

    </Page>
</template>

<script>
    import Game from "./Game";
    import Setting from "./Setting";
    import Shop from "./Shop";
    import Record from "./Record";
    import * as setting from "./common/setting";
    const fileSystemModule = require("tns-core-modules/file-system");

    export default {
        methods: {
            startGame() {
                console.log("goToGamePage");
                this.$navigateTo(Game);
            },
            goToSetting() {
                this.$navigateTo(Setting);
            },
            goToShop() {
                this.$navigateTo(Shop);
            },
            goToRecord() {
                console.log("goToRecord");
                this.$navigateTo(Record);
            }
        },
        mounted() {},

        data() {
            return {};
        }
    };
</script>

<style scoped>
    .home-panel {
        vertical-align: center;
        font-size: 20;
        margin: 15;
    }

    .logo {
        font-size: 40px;
        font-weight: bold;
        font-style: italic;
        text-align: center;
        color: #353535;
        text-decoration: underline;
    }

    .cogBtnBG {
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
    }
</style>