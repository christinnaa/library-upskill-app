<template>
    <div class="wrapper d-flex align-items-center justify-content-center">
        <b-form class="d-flex flex-column bg-white">
            <div class="circle">
                <img src="../assets/account.png" alt="">
            </div>
            <h3 class="mx-auto mb-4">LOG IN</h3>

            <b-form-group class="mb-3" id="username" label="Username" label-for="username">
                <b-form-input id="username" type="email" placeholder="Enter username" required></b-form-input>
            </b-form-group>

            <b-form-group id="password" label="Password" class="text-bold" label-for="password">
                <b-form-input id="password" type="password" placeholder="Enter password" required></b-form-input>
            </b-form-group>

            <router-link :to="{ name: 'books' }" exact>
                <b-button class="w-100 mb-2 text-white" type="submit" variant="primary">Sign In</b-button>
            </router-link>
        </b-form>
    </div>
</template>

<script>
export default {

}
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