FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-alpine AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-alpine AS build
WORKDIR /src
COPY ["todo-list-front.csproj", ""]
RUN dotnet restore "todo-list-front.csproj"
COPY . .
WORKDIR "/src/"
RUN dotnet build "todo-list-front.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "todo-list-front.csproj" -c Release -o /app

FROM base AS final
ENV RabbitApi=localhost:52620

WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "todo-list-front.dll"]