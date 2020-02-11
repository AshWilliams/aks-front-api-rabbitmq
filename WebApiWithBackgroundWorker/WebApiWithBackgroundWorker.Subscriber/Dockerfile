FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-alpine AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-alpine AS build
WORKDIR /src
COPY ["WebApiWithBackgroundWorker.Subscriber.csproj", ""]
RUN dotnet restore "WebApiWithBackgroundWorker.Subscriber.csproj"
COPY . .
WORKDIR "/src/"
RUN dotnet build "WebApiWithBackgroundWorker.Subscriber.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "WebApiWithBackgroundWorker.Subscriber.csproj" -c Release -o /app

FROM base AS final
ENV RABBIT=localhost

WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "WebApiWithBackgroundWorker.Subscriber.dll"]