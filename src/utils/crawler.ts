import axios from "axios";
import cheerio from "cheerio";
const { createConnection } = require("typeorm");
import Race from "../models/Race";
import Driver from "../models/Driver";
import Team from "../models/Team";
import fastestLap from "../models/FastestLap";
import { getConnection, getRepository } from "typeorm";
async function forceDeleteData() {
  const connection = getConnection();
  const repository1 = connection.getRepository(Driver);
  const repository2 = connection.getRepository(Race);
  const repository3 = connection.getRepository(Team);
  const repository4 = connection.getRepository(fastestLap);
  await repository1.delete({});
  await repository2.delete({});
  await repository3.delete({});
  await repository4.delete({});
  console.log("Data deleted.")
}
async function scrapeData() {
  const url = "https://www.formula1.com/en/results.html";
  await forceDeleteData();
  try {
    const years = await getAllYearExist(url);
    await Promise.all(
      years.map(async (year) => {
        await getAndSaveDriverData(await createLinkDriverByYear(year), year);
        await getAndSaveTeamData(await createLinkTeamByYear(year), year);
        await getAndSaveRaceData(await createLinkRaceByYear(year), year);
        await getAndSaveFastestLapData(await createLinkFastestLapByYear(year), year);
      })
    );
    console.log("Data scraping and saving completed.");
  } catch (error) {
    console.error(`Error scraping and saving data: ${error}`);
  }
}

// Function to fetch the HTML content of the website
async function fetchHTML(url: string) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching HTML: ${error}`);
    return null;
  }
}
async function createLinkDriverByYear(year: string) {
 return 'https://www.formula1.com/en/results.html/'+year+'/drivers.html'
}
async function createLinkRaceByYear(year: string) {
  return 'https://www.formula1.com/en/results.html/'+year+'/races.html'
 }
 async function createLinkTeamByYear(year: string) {
  return 'https://www.formula1.com/en/results.html/'+year+'/team.html'
 }
 async function createLinkFastestLapByYear(year: string) {
  return 'https://www.formula1.com/en/results.html/'+year+'/fastest-laps.html'
 }

async function getAndSaveDriverData(url: string,year:string) {
  const html = await fetchHTML(url);

  const $ = cheerio.load(html);
  const rows = $('table.resultsarchive-table tbody tr');
  rows.each((index, element) => {
    const row = $(element);
    const position = row.find('td:nth-child(2)').text().trim();
    const driverFullName = $(element).find('td a.dark.bold.ArchiveLink').text().trim().split(' ');
    driverFullName.pop()
    const driver = driverFullName.join(' ').replace(/[\r\n]/gm, '').replace( /\s+/g, ' ' ).trim()
    const nationality = row.find('td:nth-child(4)').text().trim();
    const car = row.find('td:nth-child(5) a').text().trim();
    const points = row.find('td:nth-child(6)').text().trim();
    const driverData ={
      position,driver,nationality,car,points,year
    }
    saveDriverData(driverData)
  });
}
async function getAndSaveRaceData(url: string,year:string) {
  const html = await fetchHTML(url);
  const $ = cheerio.load(html);
  const rows = $("table.resultsarchive-table tbody tr");
  rows.each((index, row) => {
    const columns = $(row).find("td");
    const grandPrix = $(columns[1]).text().trim();
    const date = $(columns[2]).text().trim();
    const winnerFirstName = $(columns[3])
      .find("span.hide-for-tablet")
      .text()
      .trim();
    const winnerLastName = $(columns[3])
      .find("span.hide-for-mobile")
      .text()
      .trim();
    const winner = winnerFirstName+" "+winnerLastName;
    const car = $(columns[4]).text().trim();
    const laps = $(columns[5]).text().trim();
    const time = $(columns[6]).text().trim();
    const raceData = {
      grandPrix,
      date,
      winner,
      car,
      laps,
      time,
      year
    };
    saveRaceData(raceData);
  });
}
async function getAndSaveFastestLapData(url: string,year:string) {
  const html = await fetchHTML(url);
  const $ = cheerio.load(html);
  const rows = $("table.resultsarchive-table tbody tr");
  rows.each((index, row) => {
    const columns = $(row).find("td");
    const grandPrix = $(columns[1]).text().trim();
    const driverFirstName = $(columns[2])
      .find("span.hide-for-tablet")
      .text()
      .trim();
    const driverLastName = $(columns[2])
      .find("span.hide-for-mobile")
      .text()
      .trim();
    const driver = driverFirstName+" "+driverLastName;
    const car = $(columns[3]).text().trim();
    const time = $(columns[4]).text().trim();
    const fastestLapData = {
      grandPrix,
      driver,
      car,
      time,
      year
    };
    //danglam
    // console.log(raceData)
    saveFastestLapData(fastestLapData);
  });
}
async function getAndSaveTeamData(url: string,year:string) {
  const html = await fetchHTML(url);
  const $ = cheerio.load(html);
  const rows = $("table.resultsarchive-table tbody tr");
  rows.each((index, row) => {
    const columns = $(row).find("td");
    const position = $(columns[1]).text().trim();
    const name = $(columns[2]).text().trim();
    const points = $(columns[3]).text().trim();
    const teamData = {
      position,
      name,
      points,
      year
    };
    saveTeamData(teamData)
  });
}
async function saveRaceData(raceData: any) {
  try {
    const race = new Race();
    race.grandPrix = raceData.grandPrix;
    race.date = raceData.date;
    race.winner = raceData.winner;
    race.car = raceData.car;
    race.laps = raceData.laps;
    race.time = raceData.time;
    race.year = raceData.year;
    await getRepository(Race).save(race);

  } catch (error) {
    console.error("Error saving race data:", error);
  }
}
async function saveDriverData(driverData: any) {
  try {
    const driver = new Driver();
    driver.position=driverData.position;
    driver.points=driverData.points;
    driver.driver=driverData.driver;
    driver.nationality=driverData.nationality;
    driver.car=driverData.car;
    driver.year=driverData.year;
    await getRepository(Driver).save(driver);
    // console.log("Driver data saved successfully.");
  } catch (error) {
    console.error("Error saving driver data:", error);
  }
}
async function saveTeamData(teamData: any) {
  try {
    const team = new Team();
    team.position=teamData.position;
    team.points=teamData.points;
    team.name=teamData.name;
    team.year=teamData.year;
    // console.log(driver)
    await getRepository(Team).save(team);
    // console.log("Team data saved successfully.");
  } catch (error) {
    console.error("Error saving team data:", error);
  }
}
async function getAllYearExist(url:string){
  const html = await fetchHTML(url);
  const $ = cheerio.load(html);
  const yearLinks = $('.resultsarchive-filter-item-link[data-name="year"]');
  const years = yearLinks.map((_, element) => {
    const year = $(element).find('.clip').text();
    return parseInt(year, 10);
  }).get();
  return years;
}
async function saveFastestLapData(fastestData: any) {
  try {
    const fastest = new fastestLap();
    fastest.grandPrix=fastestData.grandPrix
    fastest.car=fastestData.car
    fastest.driver=fastestData.driver
    fastest.time=fastestData.time
    fastest.year=fastestData.year
    // console.log(driver)
    await getRepository(fastestLap).save(fastest);
    // console.log("Fastest-Lap data saved successfully.");
  } catch (error) {
    console.error("Error saving team data:", error);
  }
}
export default scrapeData;
