import {
	astroidField,
	city,
	commArray,
	outpost,
	moon,
	planet,
	prison,
	station,
	system,
	securityPost,
	raceTrack,
	jumpPoint
} from "../helpers";

export const Stanton = system("Stanton", [
	// star("Stanton"),
	planet("Hurston", { coordinates: { azimuthal: 0, distance: 12.85 } }, [
		city("Lorville"),
		outpost("Reclamation & Disposal Orinth"),
		outpost("Rappell"),
		outpost("Zephyr"),
		outpost("Weeping Cove"),
		outpost("Maker's Point"),
		outpost("Picker's Field"),
		outpost("HDSF-Adlai"),
		outpost("HDSF-Ishmael"),
		outpost("HDSF-Hiram"),
		outpost("HDSF-Tompkins"),
		outpost("HDSF-Elbridge"),
		outpost("HDSF-Hobart"),
		outpost("HDSF-Millerand"),
		outpost("HDSF-Damaris"),
		outpost("HDSF-Barnabas"),
		outpost("HDSF-Breckinridge"),
		outpost("HDSF-Hendricks"),
		outpost("HDSF-Tamar"),
		outpost("HDSF-Rufus"),
		outpost("HDSF-Zacharias"),
		outpost("HDSF-Colfax"),
		outpost("HDSF-Sherman"),
		outpost("HDMS-Edmond"),
		outpost("HDMS-Stanhope"),
		outpost("HDMS-Thedus"),
		outpost("HDMS-Oparei"),
		outpost("HDMS-Pinewood"),
		outpost("HDES-Calthrope (NA)"),
		station("Everus Harbor", { coordinates: { azimuthal: 0, distance: 12.85 } }),
		station("Wikelo Emporium Dasi Station", { coordinates: { azimuthal: 0, distance: 12.85 } }),
		commArray("Comm Array ST1-61", { coordinates: { azimuthal: 0, distance: 12.85 } }),
		moon("Arial", { coordinates: { azimuthal: -0.13, distance: 12.89 } }, [
			outpost("HDMS-Bezdek"),
			outpost("HDMS-Lathan"),
			commArray("Comm Array ST1-13", { coordinates: { azimuthal: -0.13, distance: 12.89 } })
		]),
		moon("Aberdeen", { coordinates: { azimuthal: 0.18, distance: 12.9 } }, [
			outpost("HDMS-Anderson"),
			outpost("HDMS-Norgaard"),
			outpost("HDES-Dobbs (NA)"),
			outpost("Barton Flats Aid Shelter"),
			prison("Klescher Rehabilitation Facility"),
			commArray("Comm Array ST1-92", { coordinates: { azimuthal: 0.18, distance: 12.9 } })
		]),
		moon("Magda", { coordinates: { azimuthal: -0.33, distance: 12.79 } }, [
			outpost("HDMS-Hahn"),
			outpost("HDMS-Perlman"),
			commArray("Comm Array ST1-48", { coordinates: { azimuthal: -0.33, distance: 12.79 } })
		]),
		moon("Ita", { coordinates: { azimuthal: 0.51, distance: 12.83 } }, [
			outpost("HDMS-Ryder"),
			outpost("HDMS-Woodruff"),
			commArray("Comm Array ST1-02", { coordinates: { azimuthal: 0.51, distance: 12.83 } })
		])
	]),
	planet("Crusader", { coordinates: { azimuthal: -172, distance: 19.14 } }, [
		city("Orison"),
		outpost("Prospect Point"),
		outpost("Empyrean Park"),
		outpost("Cloudrest Retreat"),
		station("Seraphim Station", {
			coordinates: { polar: 0.01, azimuthal: -172.01, distance: 19.15 }
		}),
		commArray("Comm Array ST2-55", { coordinates: { azimuthal: -171.97, distance: 19.15 } }),
		moon("Cellin", { coordinates: { azimuthal: -171.88, distance: 19.17 } }, [
			outpost("Tram & Myers Mining"),
			outpost("PRIVATE PROPERTY"),
			outpost("Gallete Family Farms"),
			outpost("Terra Mills HydroFarm"),
			outpost("NT-999-XV"),
			outpost("Hickes Research Outpost"),
			outpost("Mogote Aid Shelter"),
			outpost("Ashburn Channel Aid Shelter"),
			outpost("Flanagan's Ravine Aid Shelter"),
			outpost("Julep Ravine Aid Shelter"),
			securityPost("Security Post Lespin"),
			securityPost("Security Post Dipur"),
			securityPost("Security Post Criska"),
			securityPost("Security Post Kareah", {
				inSpace: true,
				coordinates: { azimuthal: -171.87, distance: 19.17 }
			}),
			commArray("Comm Array ST2-28", { coordinates: { azimuthal: -171.88, distance: 19.17 } })
		]),
		moon("Daymar", { coordinates: { azimuthal: -172.14, distance: 19.1 } }, [
			outpost("Brio's Breaker Yard"),
			outpost("The Garden"),
			outpost("Nuen Waste Management"),
			outpost("Kudre Ore Mine (Closed)"),
			outpost("TPF"),
			outpost("Kudre Ore"),
			outpost("Bountiful Harvest Hydroponics"),
			outpost("Tamdon Plains Aid Shelter"),
			outpost("Dunlow Ridge Aid Shelter"),
			outpost("Wolf Point Aid Shelter"),
			outpost("Eager Flats Aid Shelter"),
			outpost("Shubin Mining Facility SCD-1"),
			outpost("ArcCorp Mining Area 141"),
			securityPost("Security Post Thaquray"),
			securityPost("Security Post Prashad"),
			securityPost("Security Post Moluto"),
			station("Covalex Shipping Hub Gundo", {
				coordinates: { azimuthal: -172.14, distance: 19.1 }
			}),
			commArray("Comm Array ST2-47", { coordinates: { azimuthal: -172.14, distance: 19.1 } })
		]),
		moon("Yela", { coordinates: { azimuthal: -172.17, distance: 19.2 } }, [
			outpost("NT-999-XX"),
			outpost("NT-999-XXII"),
			outpost("Afterlife"),
			outpost("Utopia"),
			outpost("Connor's"),
			outpost("Deakins Research Outpost"),
			outpost("Talarine Divide Aid Shelter"),
			outpost("Nakamura Valley Aid Shelter"),
			outpost("Kosso Basin Aid Shelter"),
			outpost("Aston Ridge Aid Shelter"),
			outpost("Benson Mining Outpost"),
			outpost("ArcCorp Mining Area 157"),
			securityPost("Security Post Wan"),
			securityPost("Security Post Opal"),
			raceTrack("Miner's Lament", {
				inSpace: true,
				coordinates: { azimuthal: -172.17, distance: 19.2 }
			}),
			station("Grim HEX", { coordinates: { azimuthal: -172.17, distance: 19.2 } }),
			station("Wikelo Emporium Selo Station", {
				coordinates: { azimuthal: -172.17, distance: 19.2 }
			}),
			commArray("Comm Array ST2-76", { coordinates: { azimuthal: -172.17, distance: 19.2 } })
		])
	]),
	planet("ArcCorp", { coordinates: { azimuthal: -50, distance: 28.91 } }, [
		city("Area18"),
		outpost("The Sky Scraper"),
		outpost("Area04"),
		outpost("Area06"),
		outpost("Area11"),
		outpost("Area17"),
		outpost("Area20"),
		station("Baijini Point", { coordinates: { azimuthal: -50, distance: 28.91 } }),
		commArray("Comm Array ST3-90", { coordinates: { azimuthal: -50, distance: 28.91 } }),
		moon("Lyria", { coordinates: { azimuthal: -49.78, distance: 28.96 } }, [
			outpost('"The Pit"'),
			outpost("<= UNINITIALIZED =>"),
			outpost("Elsewhere"),
			outpost('"Wheeler\'s"'),
			outpost("The Orphanage"),
			outpost("Humboldt Mines"),
			outpost("Loveridge Mineral Reserve"),
			outpost("Launch Pad"),
			outpost("Buckets"),
			outpost("Shubin Mining Facility SAL-2"),
			outpost("Shubin Mining Facility SAL-5"),
			outpost("Shubin Processing Facility SPAL-9"),
			outpost("Shubin Processing Facility SPAL-7"),
			outpost("Shubin Processing Facility SPAL-16"),
			outpost("Shubin Processing Facility SPAL-21"),
			outpost("Shubin Processing Facility SPAL-12"),
			outpost("Shubin Processing Facility SPAL-3"),
			outpost("Teddy's Playhouse"),
			commArray("Comm Array ST3-18", { coordinates: { azimuthal: -49.78, distance: 28.96 } })
		]),
		moon("Wala", { coordinates: { azimuthal: -50.12, distance: 28.66 } }, [
			outpost("Good Times Temple"),
			outpost("Lost and Found"),
			outpost("Shady Glen Farms"),
			outpost("Paradise Cove"),
			outpost("Samson & Son's Salvage Center"),
			outpost("ArcCorp Processing Center 115"),
			outpost("ArcCorp Processing Center 123"),
			outpost("ArcCorp Mining Area 045"),
			outpost("ArcCorp Mining Area 048"),
			outpost("ArcCorp Mining Area 056"),
			outpost("ArcCorp Mining Area 061"),
			commArray("Comm Array ST3-35", { coordinates: { azimuthal: -50.12, distance: 28.66 } })
		])
	]),
	planet("microTech", { coordinates: { azimuthal: 58.86, distance: 43.44 } }, [
		city("New Babbage"),
		outpost("The Necropolis"),
		outpost("Raven's Roost"),
		outpost("Ghost Hollow"),
		outpost("Harper's Point"),
		outpost("Dunboro"),
		outpost("Astor's Clearing"),
		outpost("Outpost 54"),
		outpost("Rayari Deltana Research Outpost"),
		outpost("Shubin Mining Facility SMO-22"),
		outpost("Shubin Mining Facility SMO-10"),
		outpost("Shubin Mining Facility SMO-13"),
		outpost("Shubin Mining Facility SMO-18"),
		outpost("Point Wain Emergency Shelter"),
		outpost("Clear View Emergency Shelter"),
		outpost("Nuiqsut Emergency Shelter"),
		outpost("Calhoun Pass Emergency Shelter"),
		outpost("MT OpCenter TLI-4"),
		outpost("MT DataCenter TMG-XEV-2"),
		outpost("MT DataCenter 5WQ-R2V-C"),
		outpost("MT DataCenter E2Q-NSG-Y"),
		outpost("MT DataCenter 2UB-RB9-5"),
		outpost("MT DataCenter 4HJ-LVE-A"),
		outpost("MT DataCenter KH3-AAE-L"),
		outpost("MT DataCenter QVX-J88-J"),
		outpost("MT DataCenter D79-ECG-R"),
		outpost("MT DataCenter L8P-JUC-8 (Offline)"),
		outpost("MT DataCenter 8FK-Q2X-K"),
		station("Port Tressler", { coordinates: { azimuthal: 58.86, distance: 43.44 } }),
		station("Wikelo Emporium Kinga Station", {
			coordinates: { azimuthal: 58.86, distance: 43.45 }
		}),
		commArray("Comm Array ST4-22", { coordinates: { azimuthal: 58.86, distance: 43.44 } }),
		moon("Calliope", { coordinates: { azimuthal: 58.92, distance: 43.39 } }, [
			outpost("Rayar Kaltag Research Outpost"),
			outpost("Rayari Anvik Research Outpost"),
			outpost("Shubin Processing Facility SPMC-14"),
			outpost("Shubin Processing Facility SPMC-3"),
			outpost("Shubin Processing Facility SPMC-5"),
			outpost("Shubin Processing Facility SPMC-11"),
			outpost("Shubin Processing Facility SPMC-10"),
			outpost("Shubin Mining Facility SMCa-6"),
			outpost("Shubin Mining Facility SMCa-8"),
			commArray("Comm Array ST4-31", { coordinates: { azimuthal: 58.92, distance: 43.39 } })
		]),
		moon("Clio", { coordinates: { azimuthal: 58.78, distance: 43.36 } }, [
			outpost("Rayari McGrath Research Outpost"),
			outpost("Rayari Cantwell Research Outpost"),
			commArray("Comm Array ST4-59", { coordinates: { azimuthal: 58.78, distance: 43.36 } })
		]),
		moon("Euterpe", { coordinates: { azimuthal: 58.76, distance: 43.36 } }, [
			outpost("The Icebreaker"),
			outpost("Bud's Growery"),
			outpost("Devlin Scrap & Salvage"),
			commArray("Comm Array ST4-64", { coordinates: { azimuthal: 58.76, distance: 43.36 } })
		])
	]),
	station("HUR-L1 Green Glade Station", { coordinates: { azimuthal: 0, distance: 11.56 } }),
	station("HUR-L2 Faithful Dream Station", { coordinates: { azimuthal: 0, distance: 14.13 } }),
	station("HUR-L3 Thundering Express Station", {
		coordinates: { azimuthal: -179.99, distance: 12.84 }
	}),
	station("HUR-L4 Melodic Fields Station", {
		coordinates: { azimuthal: 59.98, distance: 12.84 }
	}),
	station("HUR-L5 High Course Station", { coordinates: { azimuthal: -59.99, distance: 12.85 } }),
	station("CRU-L1 Ambitious Dream Station", {
		coordinates: { azimuthal: -171.99, distance: 17.23 }
	}),
	astroidField("CRU L2", { coordinates: { azimuthal: -171.99, distance: 21.06 } }),
	astroidField("CRU L3", { coordinates: { azimuthal: 8, distance: 19.14 } }),
	station("CRU-L4 Shallow Fields Station", {
		coordinates: { azimuthal: -112, distance: 19.14 }
	}),
	station("CRU-L5 Beautiful Glen Station", {
		coordinates: { azimuthal: 127.98, distance: 19.14 }
	}),
	station("ARC-L1 Wide Forest Station", { coordinates: { azimuthal: -50, distance: 26.02 } }),
	station("ARC-L2 Lively Pathway Station", {
		coordinates: { azimuthal: -49.99, distance: 31.81 }
	}),
	station("ARC-L3 Modern Express Station", {
		coordinates: { azimuthal: 149.99, distance: 28.92 }
	}),
	station("ARC-L4 Faint Glen Station", { coordinates: { azimuthal: 9.99, distance: 28.91 } }),
	station("ARC-L5 Yellow Core Station", { coordinates: { azimuthal: -110, distance: 28.92 } }),
	station("MIC-L1 Shallow Frontier Station", {
		coordinates: { azimuthal: 58.86, distance: 39.09 }
	}),
	station("MIC-L2 Long Forest Station", {
		coordinates: { polar: -0.01, azimuthal: 58.86, distance: 47.79 }
	}),
	station("MIC-L3 Endless Odyssey Station", {
		coordinates: { polar: -0.01, azimuthal: -121.12, distance: 43.43 }
	}),
	station("MIC-L4 Red Crossroads Station", {
		coordinates: { polar: -0.01, azimuthal: 118.85, distance: 43.45 }
	}),
	station("MIC-L5 Modern Icarus Station", {
		coordinates: { polar: -0.01, azimuthal: -1.13, distance: 43.45 }
	}),
	jumpPoint("Pyro Gateway", { coordinates: { polar: -5.42, azimuthal: -83.25, distance: 28.3 } }),
	jumpPoint("Terra Gateway", {
		coordinates: { polar: -4.82, azimuthal: -5.88, distance: 51.57 }
	}),
	jumpPoint("Magnus Gateway", {
		coordinates: { polar: 16.88, azimuthal: 159.35, distance: 69.55 }
	})
]);
