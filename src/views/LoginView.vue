<template>
    <div class="wrapper d-flex align-items-center justify-content-center">
        <b-form class="d-flex flex-column bg-white" @submit.prevent="handleLogin">
            <div class="circle">
                <img src="../assets/account.png" alt="">
            </div>
            <h3 class="mx-auto mb-4">LOG IN</h3>

            <b-form-group class="mb-3" id="username" label="Username" label-for="username">
                <b-form-input id="username" v-model="username" placeholder="Enter username" required></b-form-input>
            </b-form-group>

            <b-form-group id="password" label="Password" class="text-bold" label-for="password">
                <b-form-input id="password" v-model="password" type="password" autocomplete="off"
                    placeholder="Enter password" required></b-form-input>
            </b-form-group>

            <!-- <router-link :to="{ name: 'dashboard' }" exact> -->
            <b-button class="w-100 mb-2 text-white" type="submit" variant="primary">Sign In</b-button>
            <!-- </router-link> -->

        </b-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            username: "",
            password: "",
            state: {
                username: null,
                password: null,
            },
        };
    },
    computed: {
        loginError() {
            return this.$store.state.auth.loginError;
        }
    },

    watch: {
        loginError(error) {
            this.showToast(error);
        },
    },

    methods: {
        showToast(error) {
            this.$toast.error(error, {
                position: "bottom-right",
                timeout: 3000,
                closeOnClick: true,
                pauseOnFocusLoss: true,
                pauseOnHover: true,
                draggable: true,
                draggablePercent: 0.6,
                showCloseButtonOnHover: false,
                hideProgressBar: true,
                closeButton: "button",
                icon: true,
                rtl: false
            });
        },

        async handleLogin() {
            const user = { username: this.username, password: this.password };

            try {
                await this.$store.dispatch("login", user);
            } catch (error) {
                console.error("Error in Login", error);
                this.showToast(error.response ? error.response.data.message : "An error occurred during login");
            }
        }
    },
};
</script>

<style lang="scss" scoped>
h3 {
    font-weight: 600;
    margin-top: 30px;
    font-size: 28px;
}

form {
    width: 30rem;
    padding: 30px 35px;
    border-radius: 24px;
    position: relative;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);

    .circle {
        position: absolute;
        top: -10%;
        left: 40%;
    }

    input {
        height: 50px;
        border-radius: 7px;
    }

    button {
        height: 50px;
        font-weight: 500;
        font-size: 20px;
        border-radius: 8px !important;
        margin-top: 22px;
    }
}
</style>