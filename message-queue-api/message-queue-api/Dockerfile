FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-alpine AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-alpine AS build
WORKDIR /src
COPY ["message-queue-api.csproj", ""]
RUN dotnet restore "message-queue-api.csproj"
COPY . .
WORKDIR "/src/"
RUN dotnet build "message-queue-api.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "message-queue-api.csproj" -c Release -o /app

FROM base AS final
ENV RABBIT=localhost

WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "message-queue-api.dll"]