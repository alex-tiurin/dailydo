package com.atiurin.dailydo.di

import io.ktor.client.HttpClient

expect fun createHttpClient(): HttpClient
