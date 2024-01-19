import type { EventUser, User } from "./types";

export const testUsers: User[] = [
	{
		id: "d5d44316-a952-4e3d-8ec2-f8005809b87b",
		scName: "SyntheticDev",
		discordNickname: "SyntheticDev",
	},
	{
		id: "3e0a3cd0-c053-4ad8-8615-2c0f2da47083",
		scName: "Stiderspace",
		discordNickname: "Stiderspace",
	},
	{
		id: "101b0a1c-c3c2-4668-82e3-76f9e649f4ff",
		scName: "LoudGuns",
		discordNickname: "LoudGuns",
	},
	{
		id: "8da710c7-ba29-46ef-a028-4318cce4e746",
		scName: "Noizemaze",
		discordNickname: "Noizemaze",
	},
	{
		id: "f1746314-b7eb-4f33-8da4-f07fb26fae93",
		scName: "SlyMako",
		discordNickname: "SlyMako",
	},
	{
		id: "54bdb897-a8c5-4dbb-9125-d99efe0d6a2d",
		scName: "SykLancer",
		discordNickname: "SykLancer",
	},
	{
		id: "1892daa3-589c-484f-8745-4c3a9160cb92",
		scName: "MasterBen10",
		discordNickname: "MasterBen10",
	},
	{
		id: "a285a8ef-7c03-4cbf-97d1-225075bf731a",
		scName: "Ravnak",
		discordNickname: "Space Admiral Ravnak",
	},
];

export const testEventMembers: EventUser[] = [
	{
		user: testUsers[0],
		pending: false,
	},
	{
		user: testUsers[1],
		pending: true,
	},
	{
		user: testUsers[2],
		pending: false,
	},
	{
		user: testUsers[3],
		pending: false,
	},
	{
		user: testUsers[4],
		pending: false,
	},
	{
		user: testUsers[5],
		pending: true,
	},
	{
		user: testUsers[6],
		pending: false,
	},
	{
		user: testUsers[7],
		pending: false,
	},
];
