<script setup lang="ts">
import { ref } from 'vue';
const checkbox = ref(false);
</script>
<template>
 
    <v-row class="d-flex  mb-3">

        <v-col cols="12">
            <v-label class="font-weight-medium mb-1">Name</v-label>
            <v-text-field variant="outlined" hide-details color="primary"></v-text-field>
        </v-col>
        <v-col cols="12">
            <v-label class="font-weight-medium mb-1">Email Address</v-label>
            <v-text-field variant="outlined" type="email" hide-details color="primary"></v-text-field>
        </v-col>
        <v-col cols="12">
            <v-label class="font-weight-medium mb-1">Password</v-label>
            <v-text-field variant="outlined" type="password"  hide-details color="primary"></v-text-field>
        </v-col>
        <v-col cols="12" >
            <v-btn to="/" color="primary" rounded="pill" size="large" block   flat>Sign up</v-btn>
        </v-col>
    </v-row>
</template>
