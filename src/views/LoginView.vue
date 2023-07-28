<template>
    <div class="wrapper d-flex align-items-center justify-content-center">
        <b-form class="d-flex flex-column bg-white">
            <h3 class="mx-auto mb-4">Lou Geh Library</h3>
            <b-form-input class="mb-3" id="username" placeholder="Username" required></b-form-input>
            <b-form-input class="mb-4" id="password" placeholder="Password" required></b-form-input>
            <b-button class="w-100 mb-2" type="submit" variant="primary">Login</b-button>
        </b-form>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
form {
    width: 30rem;
    padding: 30px 35px;
    border-radius: 10px;

    input,
    button {
        height: 48px;
    }
}
</style>