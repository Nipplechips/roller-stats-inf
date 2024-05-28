const _ = require('lodash')
const uuid = require('uuid')
import XLSX from 'xlsx'
const fs = require('fs')


let template2018 = {
    "version": "2018",
    "mainSheet": "IGRF",
    "venue": {
        "name": "B3",
        "city": "I3",
        "state": "K3"
    },
    "date": "B7",
    "time": "I7",
    "tournament": "B5",
    "host-league": "I5",
    "teams": {
        "home": {
            "sheetName": "IGRF",
            "league": "B10",
            "name": "B11",
            "color": "B12",
            "firstName": "C14",
            "firstNumber": "B14",
            "maxNum": 20
        },
        "away": {
            "sheetName": "IGRF",
            "league": "I10",
            "name": "I11",
            "color": "I12",
            "firstName": "J14",
            "firstNumber": "I14",
            "maxNum": 20
        },
        "officials": {
            "sheetName": "IGRF",
            "firstName": "C60",
            "firstRole": "A60",
            "firstLeague": "H60",
            "firstCert": "K60",
            "maxNum": 28
        }
    },
    "summary": {
        "sheetName": "Game Summary",
        "maxRows": 20,
        "home": {},
        "away": {}
    },
    "score": {
        "sheetName": "Score",
        "maxJams": 38,
        "1": {
            "home": {
                "firstJamNumber": "A4",
                "firstJammerNumber": "B4",
                "firstLost": "C4",
                "firstLead": "D4",
                "firstCall": "E4",
                "firstInj": "F4",
                "firstNp": "G4",
                "firstTrip": "H4",
                "lastTrip": "P4"
            },
            "away": {
                "firstJamNumber": "T4",
                "firstJammerNumber": "U4",
                "firstLost": "V4",
                "firstLead": "W4",
                "firstCall": "X4",
                "firstInj": "Y4",
                "firstNp": "Z4",
                "firstTrip": "AA4",
                "lastTrip": "AI4"
            }
        },
        "2": {
            "home": {
                "firstJamNumber": "A46",
                "firstJammerNumber": "B46",
                "firstLost": "C46",
                "firstLead": "D46",
                "firstCall": "E46",
                "firstInj": "F46",
                "firstNp": "G46",
                "firstTrip": "H46",
                "lastTrip": "P46"
            },
            "away": {
                "firstJamNumber": "T46",
                "firstJammerNumber": "U46",
                "firstLost": "V46",
                "firstLead": "W46",
                "firstCall": "X46",
                "firstInj": "Y46",
                "firstNp": "Z46",
                "firstTrip": "AA46",
                "lastTrip": "AI46"
            }
        }
    },
    "penalties": {
        "sheetName": "Penalties",
        "maxPenalties": 9,
        "1": {
            "home": {
                "firstNumber": "A4",
                "firstPenalty": "B4",
                "firstJam": "B5",
                "firstFO": "K4",
                "firstFOJam": "K5",
                "benchExpCode": "C44",
                "benchExpJam": "C45"

            },
            "away": {
                "firstNumber": "P4",
                "firstPenalty": "Q4",
                "firstJam": "Q5",
                "firstFO": "Z4",
                "firstFOJam": "Z5",
                "benchExpCode": "R44",
                "benchExpJam": "R45"
            }
        },
        "2": {
            "home": {
                "firstNumber": "AC4",
                "firstPenalty": "AD4",
                "firstJam": "AD5",
                "firstFO": "AM4",
                "firstFOJam": "AM5",
                "benchExpCode": "AE44",
                "benchExpJam": "AE45"
            },
            "away": {
                "firstNumber": "AR4",
                "firstPenalty": "AS4",
                "firstJam": "AS5",
                "firstFO": "BB4",
                "firstFOJam": "BB5",
                "benchExpCode": "AT44",
                "benchExpJam": "AT45"
            }
        }
    },
    "lineups": {
        "sheetName": "Lineups",
        "maxJams": 38,
        "boxCodes": 3,
        "1": {
            "home": {
                "firstJamNumber": "A4",
                "firstNoPivot": "B4",
                "firstJammer": "C4"
            },
            "away": {
                "firstJamNumber": "AA4",
                "firstNoPivot": "AB4",
                "firstJammer": "AC4"
            }
        },
        "2": {
            "home": {
                "firstJamNumber": "A46",
                "firstNoPivot": "B46",
                "firstJammer": "C46"
            },
            "away": {
                "firstJamNumber": "AA46",
                "firstNoPivot": "AB46",
                "firstJammer": "AC46"
            }
        }
    },
    "clock": {
        "sheetName": "Game Clock",
        "1": {
            "firstJamTime": "B11"
        },
        "2": {
            "firstJamTime": "B62"
        }
    }
};
let template2017 = {
    "version": "2017",
    "mainSheet": "IGRF",
    "venue": {
        "name": "B3",
        "city": "H3",
        "state": "J3"
    },
    "date": "B7",
    "time": "H7",
    "tournament": "B5",
    "host-league": "H5",
    "teams": {
        "home": {
            "sheetName": "IGRF",
            "league": "B10",
            "name": "B11",
            "color": "B12",
            "firstName": "C14",
            "firstNumber": "B14",
            "maxNum": 20
        },
        "away": {
            "sheetName": "IGRF",
            "league": "H10",
            "name": "H11",
            "color": "H12",
            "firstName": "I14",
            "firstNumber": "H14",
            "maxNum": 20
        },
        "officials": {
            "sheetName": "IGRF",
            "firstName": "A60",
            "firstRole": "D60",
            "firstLeague": "H60",
            "firstCert": "J60",
            "maxNum": 28
        }
    },
    "score": {
        "sheetName": "Score",
        "maxJams": 38,
        "1": {
            "home": {
                "firstJamNumber": "A4",
                "firstJammerNumber": "B4",
                "firstLost": "C4",
                "firstLead": "D4",
                "firstCall": "E4",
                "firstInj": "F4",
                "firstNp": "G4",
                "firstTrip": "H4",
                "lastTrip": "P4"
            },
            "away": {
                "firstJamNumber": "T4",
                "firstJammerNumber": "U4",
                "firstLost": "V4",
                "firstLead": "W4",
                "firstCall": "X4",
                "firstInj": "Y4",
                "firstNp": "Z4",
                "firstTrip": "AA4",
                "lastTrip": "AI4"
            }
        },
        "2": {
            "home": {
                "firstJamNumber": "A46",
                "firstJammerNumber": "B46",
                "firstLost": "C46",
                "firstLead": "D46",
                "firstCall": "E46",
                "firstInj": "F46",
                "firstNp": "G46",
                "firstTrip": "H46",
                "lastTrip": "P46"
            },
            "away": {
                "firstJamNumber": "T46",
                "firstJammerNumber": "U46",
                "firstLost": "V46",
                "firstLead": "W46",
                "firstCall": "X46",
                "firstInj": "Y46",
                "firstNp": "Z46",
                "firstTrip": "AA46",
                "lastTrip": "AI46"
            }
        }
    },
    "penalties": {
        "sheetName": "Penalties",
        "maxPenalties": 9,
        "1": {
            "home": {
                "firstNumber": "A4",
                "firstPenalty": "B4",
                "firstJam": "B5",
                "firstFO": "K4",
                "firstFOJam": "K5",
                "benchExpCode": "C44",
                "benchExpJam": "C45"

            },
            "away": {
                "firstNumber": "P4",
                "firstPenalty": "Q4",
                "firstJam": "Q5",
                "firstFO": "Z4",
                "firstFOJam": "Z5",
                "benchExpCode": "R44",
                "benchExpJam": "R45"
            }
        },
        "2": {
            "home": {
                "firstNumber": "AC4",
                "firstPenalty": "AD4",
                "firstJam": "AD5",
                "firstFO": "AM4",
                "firstFOJam": "AM5",
                "benchExpCode": "AE44",
                "benchExpJam": "AE45"
            },
            "away": {
                "firstNumber": "AR4",
                "firstPenalty": "AS4",
                "firstJam": "AS5",
                "firstFO": "BB4",
                "firstFOJam": "BB5",
                "benchExpCode": "AT44",
                "benchExpJam": "AT45"
            }
        }
    },
    "lineups": {
        "sheetName": "Lineups",
        "maxJams": 38,
        "boxCodes": 3,
        "1": {
            "home": {
                "firstJamNumber": "A4",
                "firstNoPivot": "B4",
                "firstJammer": "C4"
            },
            "away": {
                "firstJamNumber": "AA4",
                "firstNoPivot": "AB4",
                "firstJammer": "AC4"
            }
        },
        "2": {
            "home": {
                "firstJamNumber": "A46",
                "firstNoPivot": "B46",
                "firstJammer": "C46"
            },
            "away": {
                "firstJamNumber": "AA46",
                "firstNoPivot": "AB46",
                "firstJammer": "AC46"
            }
        }
    },
    "clock": {
        "sheetName": "Game Clock",
        "1": {
            "firstJamTime": "B11"
        },
        "2": {
            "firstJamTime": "B62"
        }
    }
};
let template2023jrda = {
    "version": "2023jrda",
    "mainSheet": "IGRF",
    "venue": {
        "name": "B3",
        "city": "I3",
        "state": "K3"
    },
    "date": "B7",
    "time": "F7",
    "tournament": "B5",
    "host-league": "I5",
    "teams": {
        "home": {
            "sheetName": "IGRF",
            "league": "B10",
            "name": "B11",
            "color": "B12",
            "firstName": "C14",
            "firstNumber": "B14",
            "maxNum": 20
        },
        "away": {
            "sheetName": "IGRF",
            "league": "I10",
            "name": "I11",
            "color": "I12",
            "firstName": "J14",
            "firstNumber": "I14",
            "maxNum": 20
        },
        "officials": {
            "sheetName": "IGRF",
            "firstName": "C62",
            "firstRole": "A62",
            "firstLeague": "H62",
            "firstCert": "K62",
            "maxNum": 21
        }
    },
    "score": {
        "sheetName": "Score",
        "maxJams": 38,
        "1": {
            "home": {
                "firstJamNumber": "A4",
                "firstJammerNumber": "B4",
                "firstLost": "C4",
                "firstLead": "D4",
                "firstCall": "E4",
                "firstInj": "F4",
                "firstNp": "G4",
                "firstTrip": "H4",
                "lastTrip": "P4"
            },
            "away": {
                "firstJamNumber": "T4",
                "firstJammerNumber": "U4",
                "firstLost": "V4",
                "firstLead": "W4",
                "firstCall": "X4",
                "firstInj": "Y4",
                "firstNp": "Z4",
                "firstTrip": "AA4",
                "lastTrip": "AI4"
            }
        },
        "2": {
            "home": {
                "firstJamNumber": "A46",
                "firstJammerNumber": "B46",
                "firstLost": "C46",
                "firstLead": "D46",
                "firstCall": "E46",
                "firstInj": "F46",
                "firstNp": "G46",
                "firstTrip": "H46",
                "lastTrip": "P46"
            },
            "away": {
                "firstJamNumber": "T46",
                "firstJammerNumber": "U46",
                "firstLost": "V46",
                "firstLead": "W46",
                "firstCall": "X46",
                "firstInj": "Y46",
                "firstNp": "Z46",
                "firstTrip": "AA46",
                "lastTrip": "AI46"
            }
        }
    },
    "penalties": {
        "sheetName": "Penalties",
        "maxPenalties": 9,
        "1": {
            "home": {
                "firstNumber": "A4",
                "firstPenalty": "C4",
                "firstJam": "C5",
                "firstFO": "L4",
                "firstFOJam": "L5",
                "benchExpCode": "D44",
                "benchExpJam": "D45"

            },
            "away": {
                "firstNumber": "Q4",
                "firstPenalty": "S4",
                "firstJam": "S5",
                "firstFO": "AB4",
                "firstFOJam": "AB5",
                "benchExpCode": "T44",
                "benchExpJam": "T45"
            }
        },
        "2": {
            "home": {
                "firstNumber": "AE4",
                "firstPenalty": "AG4",
                "firstJam": "AG5",
                "firstFO": "AP4",
                "firstFOJam": "AP5",
                "benchExpCode": "AH44",
                "benchExpJam": "AH45"
            },
            "away": {
                "firstNumber": "AU4",
                "firstPenalty": "AW4",
                "firstJam": "AW5",
                "firstFO": "BF4",
                "firstFOJam": "BF5",
                "benchExpCode": "AX44",
                "benchExpJam": "AX45"
            }
        }
    },
    "lineups": {
        "sheetName": "Lineups",
        "maxJams": 38,
        "boxCodes": 3,
        "1": {
            "home": {
                "firstJamNumber": "A4",
                "firstNoPivot": "B4",
                "firstJammer": "C4"
            },
            "away": {
                "firstJamNumber": "AB4",
                "firstNoPivot": "AC4",
                "firstJammer": "AD4"
            }
        },
        "2": {
            "home": {
                "firstJamNumber": "A46",
                "firstNoPivot": "B46",
                "firstJammer": "C46"
            },
            "away": {
                "firstJamNumber": "AB46",
                "firstNoPivot": "AC46",
                "firstJammer": "AD46"
            }
        }
    }
};
let sbErrorTemplate = {
    "scores":
    {
        "scoresNotOnIGRF":
        {
            "description": "Jammer on score sheet is not on IGRF.",
            "events": [],
            "long": "A jammer on the score sheet was not listed on the IGRF page.  Should also be higlighted red in the StatsBook."
        },
        "npPoints":
        {
            "description": "NI Box checked with points on first trip",
            "events": [],
            "long": "The NI box indicates 'no initial trip', indicating that the jammer never completed their initial trip through the pack.  If points are recorded then this box should not be checked. (This error should not be raised for a correctly recorded initial pass lap point.)"
        },
        "noPointsNoNI":
        {
            "description": "No points (including a zero) on first trip, NI box not checked.",
            "events": [],
            "long": "If the jammer completes their initial pass, they should have points recorded for the first scoring trip, even if that number is zero. (Exception: if they pass the star during their first scoring trip.)"
        },
        "tooManyLead":
        {
            "description": "Lead box checked more than once in a single jam",
            "events": [],
            "long": "Only one jammer can be declared lead per jam.  This will check teammates during a star pass as well as opponents."
        },
        "tooManyCall":
        {
            "description": "Call box checked more than once in a single jam",
            "events": [],
            "long": "At most one jammer can call the jam off per jam."
        },
        "injuryOnlyOnce":
        {
            "description": "Injury box checked for one team, but not the other.",
            "events": [],
            "long": "If the jam is called for injury, it should be recorded on both score sheets."
        },
        "onlyOneStarPass":
        {
            "description": "Star pass on only one team of the score sheet.",
            "events": [],
            "long": "If one team passes the star, the scorekeeper for the other team should record SP* on their score sheet."
        },
        "badJamNumber":
        {
            "description": "Jam number out of sequence",
            "events": [],
            "long": "Jams should occur in numerical order without gaps in the numbering."
        },
        "spPointsBothJammers":
        {
            "description": "Both jammers in a star pass with points in same trip.",
            "events": [],
            "long": "In one jam, only one jammer should score points for a trip. If Jammer A has points in trip 2 and passes the star to Jammer B in trip 3, all of the points for trip 3 should be in the trip 3 column for Jammer B."
        },
        "blankTrip":
        {
            "description": "Skipped column on score sheet.",
            "events": [],
            "long": "There shouldn't be any blank spaces in the middle of a jam.  A zero should be entered if a jammer completes a scoring pass without scoring any points."
        },
        "spStarWithJammer":
        {
            "description": "Jammer entered after SP*.",
            "events": [],
            "long": "After an SP*, indicating a star pass for the opposing team only, the remainder of the line should be blank."
        },
        "pointsNoLeadNoLost":
        {
            "description": "Points scored with no lead jammer and without lost for scoring team",
            "events": [],
            "long": "For a jammer to reach a scoring trip, it must always be the case that they were awarded lead, their opponent was awarded lead, or they have lost lead."
        },
        "spLeadNoLost":
        {
            "description": "SP marked for a lead jammer without lost indicated.",
            "events": [],
            "long": "A lead jammer who passes the star always loses lead, so SP and 'lead' together must be accompanied by 'lost'."
        }

    },
    "penalties":
    {
        "penaltiesNotOnIGRF":
        {
            "description": "Skater on penalties sheet is not on IGRF.",
            "events": [],
            "long": "A skater on the penalties sheet was not listed on the IGRF page.  Should also be higlighted red in the StatsBook."
        },
        "foUnder7":
        {
            "description": "FO entered for a skater with fewer than 7 penalties",
            "events": [],
            "long": "Skaters should not foul out with fewer than 7 penalties in regulation play."
        },
        "sevenWithoutFO":
        {
            "description": "Seven or more penalties without a FO entered",
            "events": [],
            "long": "Once a skater has earned seven penalties, an 'FO' and the jam in which she fouled out should be recorded in their last column on the penalty tracking sheet."
        },
        "expulsionNoPenalty":
        {
            "description": "Expulsion entered for a jam with no penalty",
            "events": [],
            "long": "Expulsions should always be matched to a penalty issued in the same jam with the same code."
        },
        "penaltyNoLineup":
        {
            "description": "Skater with penalty entered not listed on Lineups Tab",
            "events": [],
            "long": "A skater was listed as having a penalty in a jam where they were not listed as skating on the Lineups tab.  In the extremely rare case of a penalty incurred by a skater or bench staff not participating in the jam, ignore this error."
        },
        "penaltyNoEntry":
        {
            "description": "Penalty on penalty sheet without box entry on Lineups Tab",
            "events": [],
            "long": "A skater was listed as having a penalty without a corresponding box entry code on the Lineups tab.  Can occasionally indicate a substitution or long service. (See warnings)"
        },
        "penaltyBadJam":
        {
            "description": "Penalty entered for bad jam number. (Out of range, or not a number)",
            "events": [],
            "long": "A penalty was entered with a jam number higher than the maximum jam on the score sheet."
        },
        "codeNoJam":
        {
            "description": "Penalty code without jam number, or jam number without penalty.",
            "events": [],
            "long": "On the penalty sheet, either a penalty code was entered without a jam number, or a jam number was entered without a penalty code."
        },
        "foBadJam":
        {
            "description": "Foulout or expulsion entered for bad jam number. (Out of range, or not a number)",
            "events": [],
            "long": "A foulout or expulsion was entered with a jam number higher than the maximum jam on the score sheet, or with an invalid number."
        }
    },
    "lineups":
    {
        "lineupsNotOnIGRF":
        {
            "description": "Skater on lineups sheet is not on IGRF.",
            "events": [],
            "long": "A skater on the lineups sheet was not listed on the IGRF page.  Should also be higlighted red in the StatsBook."
        },
        "samePlayerTwice":
        {
            "description": "Same player entered more than once in the same jam",
            "events": [],
            "long": "The same skater was entered twice for the same jam.  As all skaters are required to have unique numbers, this indicates either an error or a time travel paradox."
        },
        "xNoPenalty":
        {
            "description": "X marked for player with no corresponding penalty",
            "events": [],
            "long": "A player was notated as entering (or continuing in) the box without a penalty marked for the same or prior jam on the penalty sheet. (2017)",
            "noTest": true
        },
        "plusNoPenalty":
        {
            "description": "+ marked for player with no corresponding penalty",
            "events": [],
            "long": "A player was notated as entering the box without a penalty marked for the same or prior jam on the penalty sheet. (2019)"
        },
        "slashNoPenalty":
        {
            "description": "/ marked for player with no corresponding penalty",
            "events": [],
            "long": "A player was marked as entering the box without a penalty in the same or prior jam on the penalty sheet. (2017)",
            "noTest": true
        },
        "dashNoPenalty":
        {
            "description": "- marked for player with no corresponding penalty",
            "events": [],
            "long": "A player was marked as entering the box without a penalty in the same or prior jam on the penalty sheet. (Exception: player in queue for an entire jam.) (2019)"
        },
        "sNoPenalty":
        {
            "description": "S marked for player with no penalty in current or prior jam. (Possible Substitute)",
            "events": [],
            "long": "A player was marked as starting in the box without a penalty in the current or prior jam.  Could potentially indicate a substitute. (See warnings)"
        },
        "sSlashNoPenalty":
        {
            "description": "$ marked for player with no penalty in current or prior jam",
            "events": [],
            "long": "A player was marked as starting and finishing in the box without a penalty in the current or prior jam.  Could potentially indicate a substitute. (See warnings)"
        },
        "iNotInBox":
        {
            "description": "I or | marked for player with no box entry.",
            "events": [],
            "long": "A player was marked as continuing in the box without a corresponding box entry in a prior jam. (2017)",
            "noTest": true
        },
        "seatedNoCode":
        {
            "description": "Skater previously seated in box with no code on present line.",
            "events": [],
            "long": "A skater, previously seated in the box, does not have a continuation marked to indicate that they continued in the box. Could potentially indicate a substitute. (See warnings)"
        },
        "startsWhileThere":
        {
            "description": "S or $ entered for skater already in the box.",
            "events": [],
            "long": "Skaters who have already been seated in the box should be indicated with I or X.  S and $ are reserved for skaters who report to the box between jams. (2017)",
            "noTest": true
        },
        "seatedNotLinedUp":
        {
            "description": "Previously penalized skater not on lineup.",
            "events": [],
            "long": "A skater who was issued a penalty in a prior jam does not appear in the lineup for this jam.  May also indicate a substitution."
        },
        "starPassNoPivot":
        {
            "description": "No Pivot box not checked on line with Star Pass",
            "events": [],
            "long": "After a star pass, the 'no pivot' box should be checked to indicate that there is no longer a pivot on the team with the pass."
        },
        "spStarSkater":
        {
            "description": "Skaters entered on SP* line.",
            "events": [],
            "long": "On a line beginning with SP* (star pass by opposing team), no further information should be entered in that row on the lineups tab."
        },
        "runeUsed":
        {
            "description": "ᚾ used in statsbook file instead of X.",
            "events": [],
            "long": "While the ᚾ character is used during paper entry, the statsbook manual specifies that an 'X' should be entered in the actual Excel file. (2017)",
            "noTest": true
        },
        "foInBox":
        {
            "description": "Fouled out skater marked as continuing in box in subsequent jam.",
            "events": [],
            "long": "After a skater has fouled out, they should not appear in the lineups for subsequent jams."
        },
        "badLineupCode":
        {
            "description": "An unrecognized box code was used. Wrong statsbook version?",
            "events": [],
            "long": "This error is thrown if a character is present in the box code colums that shouldn't be there. This checker assumes that 2019 statsbooks are entered according to the 2019 statsbook manual, etc. Check your statsbook file version if you are receiving this error."
        }

    },
    "warnings":
    {
        "missingData":
        {
            "description": "IGRF missing the following information:",
            "events": [],
            "long": "One or more pieces of general information about the game are missing."
        },
        "leadPenaltyNotLost":
        {
            "description": "Jammer with lead and penalty without 'lost' checked.",
            "events": [],
            "long": "If the lead jammer earns a penalty, they lose lead.  However, if the penalty is issued after the jam is called, it is correct to leave the 'lost' box unchecked."
        },
        "possibleSub":
        {
            "description": "Reported errors may actually be substitution.",
            "events": [],
            "long": "Checks for several sets of conditions that may indicate that the reported errors are in fact a box substitution.  Since substitutions are not indicated in the StatsBook file, check the paperwork for handwritten notes."
        },
        "lastJamNoEntry":
        {
            "description": "No box entry listed for skater penalized in final jam.",
            "events": [],
            "long": "Skaters penalized in the last jam sometimes fail to report to the box, and this is not necessarily an error in the paperwork."
        },
        "SPNoPointsNoNI":
        {
            "description": "No points and no NI entered - star pass after initial or error?",
            "events": [],
            "long": "If a jammer passes the star in their first scoring trip, then having neither points nor the NI box is correct."
        },
        "lostNoPenalty":
        {
            "description": "Lost lead checked without a corresponding penalty.",
            "events": [],
            "long": "Most of the time 'lost lead' indicates that a jammer receieved a penalty on their initial trip. However, it is possible that this is not an error."
        },
        "injNoThree":
        {
            "description": "Jam called for injury without a '3' marked on the lineups tab.",
            "events": [],
            "long": "When the jam is called for injury, usually there should be an injured skater marked with a '3' on the lineups tab."
        },
        "emptyLineupNoComment":
        {
            "description": "Empty box on lineup sheet without an accompanying comment.",
            "events": [],
            "long": "An empty box on the lineup sheet could indicate that fewer than a full lineup took the track that jam, that the information is missing, or it could be a data entry error.  Excel comments are a good way to indicate why a box is empty, but are not mandatory."
        },
        "oldStatsbookVersion":
        {
            "description": "Out of date statsbook file version.",
            "events": [],
            "long": "The version of the .xlsx file used to enter this statsbook is not the most current. If you are using codes from a different year than the file, the checker may throw odd errors.",
            "noTest": true
        },
        "sixPenaltiesPlusExpulsion":
        {
            "description": "Exactly six penalties plus expulsion. Seventh penalty in wrong colum?",
            "events": [],
            "long": "When there are exactly six penalties entered plus a penalty code in the FO/EXP column, that often means a seventh regular penalty was incorrectly entered as an expulsion.  If the skater was actually expelled for their seventh penalty, ignore this warning."
        }
    }
};

class WFTDAStatbookConverter {
    private sbData: any = {};  // derbyJSON formatted statsbook data
    private sbTemplate: any = {};
    private sbErrors: any = {};
    private penalties: any = {};
    private starPasses: any[] = [];
    private sbFilename: string = '';
    private sbVersion: string = '';
    private warningData: any = {};
    private googleSheet: string = '';
    private teamList: string[] = ['home', 'away'];
    private anSP = /^sp\*?$/i
    private mySP = /^sp$/i
    private anINJ = /^inj\*?$/i


    convertToJson(workbookData: Uint8Array): any {

        console.debug("Converting workbook data", workbookData);

        let workbook = undefined;
        try {
            workbook = XLSX.read(workbookData, { type: 'array' });
        } catch (error) {
            console.error("Error reading workbook data", error);
            return "";
        }

        // Reinitialize globals
        this.sbData = {}
        this.sbErrors = JSON.parse(JSON.stringify(sbErrorTemplate))
        this.penalties = {}
        this.starPasses = []
        this.warningData = {
            badStarts: [],
            noEntries: [],
            badContinues: [],
            noExits: [],
            foulouts: [],
            expulsions: [],
            lost: [],
            jamsCalledInjury: [],
            lineupThree: []
        }

        // Read Statsbook
        this.getVersion(workbook)
        console.debug("Reading statbook version");
        this.readIGRF(workbook)
        console.debug("Reading statbook IGRF");
        for (var i in this.teamList) {
            console.debug(`Reading team: ${this.teamList[i]}`, this.teamList[i]);
            this.readTeam(workbook, this.teamList[i])
        }

        this.readOfficials(workbook)
        console.debug("Reading officials");
        this.sbData.periods = { '1': { jams: [] }, '2': { jams: [] } }
        this.readScores(workbook)
        console.debug("Reading scores");
        this.readPenalties(workbook)
        console.debug("Reading penalties");
        this.readLineups(workbook)
        console.debug("Reading lineups");

        this.errorCheck()
        console.debug("Statbook error check", this.sbErrors);
        this.warningCheck()
        console.debug("Statbook warning check", this.warningData);

        console.debug("Statbook warnings", this.warningData);
        console.debug("Statbook errors", this.sbErrors);

        console.debug("Stringifying statbook data", this.sbData);
        return this.sbData;
    }

    getVersion = (workbook: { Sheets: { [x: string]: any } }) => {
        // Determine version of Statsbook file.

        let currentVersion = '2019'
        const currentJRDAVersion = '2024jrda'
        const defaultVersion = '2018'
        const sheet = workbook.Sheets['Read Me']
        const versionText: string = (sheet ? sheet['A3'].v : defaultVersion)
        const versionRe = /(\d){4}/
        this.sbVersion = versionRe.exec(versionText)![0];
        if (versionText.toLowerCase().includes('jrda')) {
            this.sbVersion = this.sbVersion.concat('jrda')
        }

        switch (this.sbVersion) {
            case '2024jrda':
            case '2023jrda':
                this.sbTemplate = template2023jrda
                currentVersion = currentJRDAVersion
                break
            case '2019':
            case '2018':
                this.sbTemplate = template2018
                break
            case '2017':
                this.sbTemplate = template2017
                break
            default:
                this.sbTemplate = {}
        }

        // Warning check: outdated statsbook version
        // Note that this will ALSO fire if the statsbook version is NEWER.
        if (this.sbVersion != currentVersion) {
            this.sbErrors.warnings.oldStatsbookVersion.events.push(
                `This File: ${this.sbVersion}  Current Supported Version: ${currentVersion} `
            )
        }

        // Check for NEWER statsbook version
        if (this.sbVersion > currentVersion) {
            this.sbVersion.includes('jrda') ? this.sbVersion = currentJRDAVersion : this.sbVersion = currentVersion
        }
    }

    readIGRF = (workbook: { Sheets: { [x: string]: any } }) => {
        // read IGRF data into the sbData file

        let getJsDateFromExcel = (excelDate: number) => {
            // Helper function to convert Excel date to JS format
            if (!excelDate) { return undefined }

            return new Date((excelDate - (25567 + 2)) * 86400 * 1000)
        }

        let getJsTimeFromExcel = (excelTime: number) => {
            // Helper function to convert Excel time to JS format
            if (!excelTime) { return undefined }

            let secondsAfterMid = excelTime * 86400
            let hours = Math.floor(secondsAfterMid / 3600)
            let remainder = secondsAfterMid % 3600
            let minutes = Math.floor(remainder / 60)
            let seconds = remainder % 60
            return (`${hours.toString().padStart(2, '0')
                }:${minutes.toString().padStart(2, '0')
                }:${seconds.toString().padStart(2, '0')}`)
        }

        let sheet = workbook.Sheets[this.sbTemplate.mainSheet]
        this.sbData.venue = {}
        this.sbData.venue.name = this.cellVal(sheet, this.sbTemplate.venue.name)
        this.sbData.venue.city = this.cellVal(sheet, this.sbTemplate.venue.city)
        this.sbData.venue.state = this.cellVal(sheet, this.sbTemplate.venue.state)

        // Deal with the fact that Date and Time could be strings or 
        // Excel date/time values.

        let date = _.get(sheet, this.sbTemplate.date)
        if (date.t == 'n') {
            this.sbData.date = getJsDateFromExcel(date.v)
        } else if (date.t == 's') {
            this.sbData.date = new Date(date.v.slice(0, 4), date.v.slice(5, 7), date.v.slice(8, 10))
        }

        let time = _.get(sheet, this.sbTemplate.time)
        if (!time || !time.hasOwnProperty('t')) {
            this.sbData.time = '' // Fail gracefully if time is undefined
        } else {
            if (time.t == 'n') {
                this.sbData.time = getJsTimeFromExcel(time.v)
            } else if (time.t == 's') {
                this.sbData.time = time.v
            }
        }

        let props = ['this.sbData.venue.name',
            'this.sbData.venue.city',
            'this.sbData.venue.state',
            'this.sbData.date',
            'this.sbData.time']
        let propNames = ['Venue Name', 'Venue City', 'Venue State', 'Date', 'Time']

        for (let p in props) {
            if (!eval(props[p])) {
                this.sbErrors.warnings.missingData.events.push(
                    `${propNames[p]}`
                )
            }
        }

    }

    readTeam = (workbook: { Sheets: { [x: string]: any } }, team: string) => {
        // team should be "home" or "away"
        let name_address = { c: 0, r: 0 },
            num_address = { c: 0, r: 0 },
            firstNameAddress: any = {},
            firstNumAddress: any = {},
            skaterNameObject: any = {},
            skaterName: any = '',
            skaterNumber: any = '',
            skaterData = {},
            sheet = workbook.Sheets[this.sbTemplate.teams[team].sheetName]


        // Extract general team data
        if (!this.sbData.hasOwnProperty('teams')) { this.sbData.teams = {} }
        this.sbData.teams[team] = {}
        this.sbData.teams[team].league = this.cellVal(sheet, this.sbTemplate.teams[team].league)
        this.sbData.teams[team].name = this.cellVal(sheet, this.sbTemplate.teams[team].name)
        this.sbData.teams[team].color = this.cellVal(sheet, this.sbTemplate.teams[team].color)

        if (!this.sbData.teams[team].color) {
            this.sbErrors.warnings.missingData.events.push(
                `Missing color for ${this.ucFirst(team)} team.`
            )
        }

        // Extract skater data
        firstNameAddress = XLSX.utils.decode_cell(this.sbTemplate.teams[team].firstName)
        firstNumAddress = XLSX.utils.decode_cell(this.sbTemplate.teams[team].firstNumber)
        name_address.c = firstNameAddress.c
        num_address.c = firstNumAddress.c
        let maxNum = this.sbTemplate.teams[team].maxNum
        this.sbData.teams[team].persons = []

        for (var i = 0; i < maxNum; i++) {
            // For each skater, read in name and number, add to sbData
            name_address.r = firstNameAddress.r + i
            num_address.r = firstNumAddress.r + i

            skaterNumber = sheet[XLSX.utils.encode_cell(num_address)]
            if (skaterNumber == undefined || skaterNumber.v == undefined) { continue }

            skaterNameObject = sheet[XLSX.utils.encode_cell(name_address)]
            skaterName = (_.get(skaterNameObject, 'v') == undefined ? '' : skaterNameObject.v)
            skaterData = { name: skaterName, number: skaterNumber.v }
            this.sbData.teams[team].persons.push(skaterData)
            this.penalties[team + ':' + skaterNumber.v] = []
        }


    }

    readOfficials = (workbook: { Sheets: { [x: string]: any } }) => {
        // Read in officials' data

        let props = ['firstName', 'firstRole', 'firstLeague', 'firstCert'],
            sheet = workbook.Sheets[this.sbTemplate.teams.officials.sheetName],
            maxNum = this.sbTemplate.teams.officials.maxNum,
            nameAddress: any = {},
            roleAddress: any = {},
            leagueAddress: any = {},
            certAddress: any = {}

        this.sbData.teams.officials = {}
        this.sbData.teams.officials.persons = []

        let cells: any = {}
        for (let i = 0; i < props.length; i++) {
            cells[props[i]] = XLSX.utils.decode_cell(
                this.sbTemplate.teams.officials[props[i]]
            )

        }

        nameAddress.c = cells.firstName.c
        roleAddress.c = cells.firstRole.c
        leagueAddress.c = cells.firstLeague.c
        certAddress.c = cells.firstCert.c

        for (var i = 0; i < maxNum; i++) {
            nameAddress.r = cells.firstName.r + i
            roleAddress.r = cells.firstRole.r + i
            leagueAddress.r = cells.firstLeague.r + i
            certAddress.r = cells.firstCert.r + i

            // Require presence of both a name and a role to record a line:
            let offName = sheet[XLSX.utils.encode_cell(nameAddress)]
            let offRole = sheet[XLSX.utils.encode_cell(roleAddress)]
            if (offRole == undefined || offName == undefined) { continue }

            let offData = { name: offName.v, roles: [offRole.v], league: {}, certifications: {} }

            // Also record league and cert if present
            let offLeague: any = sheet[XLSX.utils.encode_cell(leagueAddress)]
            if (offLeague != undefined) {
                offData.league = offLeague.v
            }
            let offCert = sheet[XLSX.utils.encode_cell(certAddress)]
            if (offCert != undefined) {
                offData.certifications = [{ level: offCert.v }]
            }

            this.sbData.teams.officials.persons.push(offData)
        }

    }

    readGameSummary = (workbook: { Sheets: { [x: string]: any } }) => {
        let sheet = workbook.Sheets[this.sbTemplate.summary.sheetName];
    };

    readScores = (workbook: { Sheets: { [x: string]: any } }) => {
        // Given a workbook, extract the information from the score tab

        let cells: any = {},
            maxJams = this.sbTemplate.score.maxJams,
            sheet = workbook.Sheets[this.sbTemplate.score.sheetName],
            jamAddress: any = {},
            jammerAddress: any = {},
            jamNumber: any = {},
            tripAddress: any = {},
            lostAddress: any = {},
            leadAddress: any = {},
            callAddress: any = {},
            injAddress: any = {},
            npAddress: any = {},
            skater: any = {}

        let props = ['firstJamNumber', 'firstJammerNumber', 'firstLost', 'firstLead',
            'firstCall', 'firstInj', 'firstNp', 'firstTrip', 'lastTrip']
        let tab = 'score'
        let npRe = /(\d)\+NP/
        let ippRe = /(\d)\+(\d)/
        let jamNoRe = /^(\d+|SP|SP\*|INJ|INJ\*)$/i

        for (let period = 1; period < 3; period++) {
            // For each period, import data

            // Add a period object with a jams array
            let pstring = period.toString()

            for (var i in this.teamList) {
                // For each team

                // Setup variables.  Jam is 0 indexed (1 less than jam nubmer).  Trip is 1 indexed.
                let team = this.teamList[i]
                let jam = 0
                let trip = 1
                let starPass = false

                // Get an array of starting points for each type of info
                cells = this.initCells(team, pstring, tab, props)
                let maxTrips = cells.lastTrip.c - cells.firstTrip.c
                jamAddress.c = cells.firstJamNumber.c
                jammerAddress.c = cells.firstJammerNumber.c
                tripAddress.c = cells.firstTrip.c
                lostAddress.c = cells.firstLost.c
                leadAddress.c = cells.firstLead.c
                callAddress.c = cells.firstCall.c
                injAddress.c = cells.firstInj.c
                npAddress.c = cells.firstNp.c

                for (let l = 0; l < maxJams; l++) {
                    // For each line in the scoresheet, import data.

                    let blankTrip = false
                    let isLost = false
                    let isLead = false

                    // increment addresses
                    jamAddress.r = cells.firstJamNumber.r + l
                    jammerAddress.r = cells.firstJammerNumber.r + l
                    tripAddress.r = cells.firstTrip.r + l
                    lostAddress.r = cells.firstLost.r + l
                    leadAddress.r = cells.firstLead.r + l
                    callAddress.r = cells.firstCall.r + l
                    injAddress.r = cells.firstInj.r + l
                    npAddress.r = cells.firstNp.r + l

                    // determine current jam number
                    jamNumber = sheet[XLSX.utils.encode_cell(jamAddress)]

                    // if we're out of jams, stop
                    if (
                        _.get(jamNumber, 'v') == undefined ||
                        /^\s+$/.test(jamNumber.v)
                    ) { break }

                    // Test for invalid jam number, throw error and stop
                    if (!jamNoRe.test(_.trim(jamNumber.v))) {
                        throw new Error(`Invalid Jam Number: ${jamNumber.v}`)
                    }

                    // handle star passes and injuries
                    if (this.anSP.test(jamNumber.v)) {
                        starPass = true
                        if (this.mySP.test(jamNumber.v)) {
                            this.sbData.periods[pstring].jams[jam - 1].events.push(
                                {
                                    event: 'star pass',
                                    skater: skater
                                }
                            )
                        }
                        this.starPasses.push({ period: period, jam: jam })
                    } else if (this.anINJ.test(jamNumber.v)) {
                        // Will we need more code here?  Stay tuned.
                        continue
                    } else {
                        // Not a star pass or injury

                        // Error check - is this jam number out of sequence?
                        if (parseInt(jamNumber.v) != (jam + 1)) {
                            this.sbErrors.scores.badJamNumber.events.push(
                                `Team: ${this.ucFirst(team)}, Period: ${pstring}, Jam: ${parseInt(jamNumber.v)}`
                            )

                            // Add jam objects for missing jams.
                            for (let j = jam + 1; j < parseInt(jamNumber.v); j++) {
                                this.sbData.periods[pstring].jams[j - 1] = { number: j, events: [] }
                            }
                        }

                        //Update the jam, reset the trip
                        jam = parseInt(jamNumber.v)
                        trip = 1
                        starPass = false
                    }

                    // If there isn't currently a numbered object for this jam, create it
                    // Note that while the "number" field is one indexed, the jams array itself is zero indexed
                    if (!this.sbData.periods[pstring].jams.find((o: { number: number }) => o.number === jam)) {
                        this.sbData.periods[pstring].jams[jam - 1] = { number: jam, events: [] }
                    }

                    // Process trips.
                    // Add a "pass" object for each trip, including initial passes
                    // (note that even incomplete initial passes get "pass" events.)
                    let skaterNum = ' '

                    // Check for no initial pass box checked
                    let np = _.get(sheet[XLSX.utils.encode_cell(npAddress)], 'v')
                    let initialCompleted = ((np == undefined || np == '') ? 'yes' : 'no')

                    if (sheet[XLSX.utils.encode_cell(jammerAddress)] != undefined) {
                        skaterNum = sheet[XLSX.utils.encode_cell(jammerAddress)].v
                    }

                    // ERROR CHECK: Skater on score sheet not on the IGRF
                    if (skaterNum != ' ' &&
                        this.sbData.teams[team].persons.findIndex((x: { number: string }) => x.number == skaterNum) == -1) {
                        // This SHOULD be caught by conditional formatting in Excel, but there
                        // are reports of that breaking sometimes.
                        this.sbErrors.scores.scoresNotOnIGRF.events.push(
                            `Team: ${this.ucFirst(team)}, Period: ${period}, Jam: ${jam}, Skater: ${skaterNum} `
                        )
                    }

                    if (!starPass) {
                        // If this line is not a star pass, create an intital pass object

                        skater = team + ':' + skaterNum
                        this.sbData.periods[period].jams[jam - 1].events.push(
                            {
                                event: 'pass',
                                number: 1,
                                score: '',
                                skater: skater,
                                team: team,
                                completed: initialCompleted
                            }
                        )
                    } else if (this.mySP.test(jamNumber.v)) {
                        // If THIS team has a star pass, use the skater number from the sheet

                        skater = team + ':' + skaterNum

                        // If this is still the initial trip, add another initial pass object.
                        if (trip == 1) {
                            this.sbData.periods[period].jams[jam - 1].events.push(
                                {
                                    event: 'pass',
                                    number: 1,
                                    score: '',
                                    skater: skater,
                                    team: team,
                                    completed: initialCompleted
                                }
                            )
                        }

                    } else {
                        // Final case - jam number is SP*.
                        if (skaterNum != ' ') {
                            this.sbErrors.scores.spStarWithJammer.events.push(
                                `Team: ${this.ucFirst(team)}, Period: ${period}, Jam: ${jam}`
                            )
                        }
                    }


                    // Check for subsequent trips, and add additional pass objects
                    for (let t = 2; t < maxTrips + 2; t++) {
                        tripAddress.c = cells.firstTrip.c + t - 2
                        let tripScore = sheet[XLSX.utils.encode_cell(tripAddress)]

                        if (tripScore == undefined) {

                            // ERROR CHECK - no trip score, initial pass completed
                            if (initialCompleted == 'yes' && t == 2 && !starPass) {
                                let nextJamNumber = sheet[XLSX.utils.encode_cell({
                                    r: jamAddress.r + 1, c: jamAddress.c
                                })]
                                if (_.get(nextJamNumber, 'v') == 'SP') {
                                    this.sbErrors.warnings.SPNoPointsNoNI.events.push(
                                        `Team: ${this.ucFirst(team)}, Period: ${period}, Jam: ${jam}, Jammer: ${skaterNum}`
                                    )
                                } else {
                                    this.sbErrors.scores.noPointsNoNI.events.push(
                                        `Team: ${this.ucFirst(team)}, Period: ${period}, Jam: ${jam}, Jammer: ${skaterNum}`
                                    )
                                }
                            }

                            // Go on to next cell
                            blankTrip = true
                            continue
                        }

                        // Error check - points entered for a trip that's already been completed.
                        if (t <= trip) {
                            this.sbErrors.scores.spPointsBothJammers.events.push(
                                `Team: ${this.ucFirst(team)}, Period: ${period}, Jam: ${jam}`
                            )
                        }

                        // Error check - skipped column in a non star pass line
                        if (blankTrip && !starPass) {
                            blankTrip = false
                            this.sbErrors.scores.blankTrip.events.push(
                                `Team: ${this.ucFirst(team)}, Period: ${period}, Jam: ${jam}`
                            )
                        }

                        let reResult: any = []
                        let ippResult: any = []
                        let points = 0

                        if ((reResult = npRe.exec(tripScore.v))) {
                            // If score is x + NP, extract score and update initial trip
                            points = reResult[1]
                            this.sbData.periods[period].jams[jam - 1].events.find(
                                (x: { event: string; number: number; skater: {} }) => x.event == 'pass' && x.number == 1 && x.skater == skater
                            ).score = points
                        } else if (tripScore.f != undefined && (ippResult = ippRe.exec(tripScore.f))) {
                            // If score is x + x, extract scores and add points to prior AND current trip
                            if (!starPass) { trip++ }
                            this.sbData.periods[period].jams[jam - 1].events.find(
                                (x: { event: string; number: number; skater: {} }) => x.event == 'pass' && x.number == 1 && x.skater == skater
                            ).score = ippResult[1]
                            this.sbData.periods[period].jams[jam - 1].events.push(
                                {
                                    event: 'pass',
                                    number: t,
                                    score: ippResult[2],
                                    skater: skater,
                                    team: team
                                }
                            )
                        } else {
                            // Normal scoring trip
                            if (!starPass) { trip++ }
                            points = tripScore.v
                            this.sbData.periods[period].jams[jam - 1].events.push(
                                {
                                    event: 'pass',
                                    number: t,
                                    score: points,
                                    skater: skater,
                                    team: team
                                }
                            )
                        }

                        // ERROR CHECK: No Initial box checked with points given.
                        if (initialCompleted == 'no' && !reResult) {
                            this.sbErrors.scores.npPoints.events.push(
                                `Team: ${this.ucFirst(team)}, Period: ${period}, Jam: ${jam}, Jammer: ${skaterNum} `
                            )
                        }


                    }
                    // Lost Lead
                    let lost = _.get(sheet[XLSX.utils.encode_cell(lostAddress)], 'v')
                    if (lost != undefined && lost != '') {
                        isLost = true
                        this.sbData.periods[period].jams[jam - 1].events.push(
                            {
                                event: 'lost',
                                skater: skater
                            }
                        )
                        this.warningData.lost.push(
                            {
                                skater: skater,
                                team: team,
                                period: period,
                                jam: jam
                            }
                        )
                    }
                    // Lead
                    let lead = _.get(sheet[XLSX.utils.encode_cell(leadAddress)], 'v')
                    if (lead != undefined && lead != '') {
                        isLead = true
                        this.sbData.periods[period].jams[jam - 1].events.push(
                            {
                                event: 'lead',
                                skater: skater
                            }
                        )
                    }
                    // Call
                    let call = _.get(sheet[XLSX.utils.encode_cell(callAddress)], 'v')
                    if (call != undefined && call != '') {
                        this.sbData.periods[period].jams[jam - 1].events.push(
                            {
                                event: 'call',
                                skater: skater
                            }
                        )
                    }
                    // Injury
                    let inj = _.get(sheet[XLSX.utils.encode_cell(injAddress)], 'v')
                    if (inj != undefined && inj != '') {
                        this.warningData.jamsCalledInjury.push(
                            {
                                team: team,
                                period: period,
                                jam: jam
                            }
                        )
                    }

                    // Error check - SP and lead without lost
                    if (this.mySP.test(jamNumber.v) && isLead && !isLost) {
                        this.sbErrors.scores.spLeadNoLost.events.push(
                            `Team: ${this.ucFirst(team)}, Period: ${period}, Jam: ${jam}`
                        )
                    }
                }

            }
            // End of period - check for cross team errors and process injuries

            for (let j in this.sbData.periods[period].jams) {
                // For each jam in the period
                let jam = parseInt(j) + 1

                let numLead = this.sbData.periods[period].jams[j].events.filter(
                    (x: { event: string }) => x.event == 'lead'
                ).length

                // ERROR CHECK: Lead box checked more than once in the same jam
                if (numLead >= 2) {
                    this.sbErrors.scores.tooManyLead.events.push(
                        `Period: ${period}, Jam: ${jam}`
                    )
                }

                // ERROR CHECK: Call box checked for both jammers in same jam
                if (this.sbData.periods[period].jams[j].events.filter(
                    (x: { event: string }) => x.event == 'call'
                ).length >= 2) {
                    this.sbErrors.scores.tooManyCall.events.push(
                        `Period: ${period}, Jam: ${jam}`
                    )
                }

                // Record one injury event for each jam with the box checked.
                let numInjuries = this.warningData.jamsCalledInjury.filter(
                    (x: { period: number; jam: number }) => x.period == period && x.jam == (parseInt(j) + 1)
                ).length
                if (numInjuries >= 1) {
                    this.sbData.periods[period].jams[j].events.push(
                        {
                            event: 'injury'
                        }
                    )
                }

                // ERROR CHECK: Injury box checked for only one team in a jam.
                if (numInjuries == 1) {
                    this.sbErrors.scores.injuryOnlyOnce.events.push(
                        `Period: ${period}, Jam: ${jam}`
                    )
                }

                // ERROR Check: Points scored with:
                // Neither team decleared lead
                // Scoring team not declared lost
                if (numLead == 0) {
                    for (let t in this.teamList) {
                        let isLost = this.sbData.periods[period].jams[j].events.find(
                            (x: { event: string; skater: string }) => x.event == 'lost' && x.skater.substr(0, 4) == this.teamList[t]
                        )
                        let scoreTrip = this.sbData.periods[period].jams[j].events.find(
                            (x: { event: string; team: any; number: number }) => x.event == 'pass' && x.team == this.teamList[t] && x.number > 1
                        )
                        if (scoreTrip != undefined && isLost == undefined) {
                            this.sbErrors.scores.pointsNoLeadNoLost.events.push(
                                `Team: ${this.ucFirst(this.teamList[t])}, Period: ${period}, Jam: ${jam}`
                            )
                        }
                    }
                }
            }
        }
        // All score data read

        // Error check: Star pass marked for only one team in a jam.
        for (var sp in this.starPasses) {
            if (this.starPasses.filter(
                (x: { period: any; jam: any }) => x.period == this.starPasses[sp].period && x.jam == this.starPasses[sp].jam
            ).length == 1) {
                this.sbErrors.scores.onlyOneStarPass.events.push(
                    `Period: ${this.starPasses[sp].period} Jam: ${this.starPasses[sp].jam}`
                )
            }
        }
    }

    readPenalties = (workbook: { Sheets: { [x: string]: any } }) => {
        // Given a workbook, extract the data from the "Penalties" tab.

        let cells: any = {},
            numberAddress: any = {},
            penaltyAddress: any = {},
            jamAddress: any = {},
            foAddress: any = {},
            foJamAddress: any = {},
            benchExpCodeAddress: any = {},
            benchExpJamAddress: any = {},
            foulouts: any = [],
            maxPenalties = this.sbTemplate.penalties.maxPenalties,
            sheet = workbook.Sheets[this.sbTemplate.penalties.sheetName]

        for (let period = 1; period < 3; period++) {
            // For each period

            let pstring = period.toString()

            let props = ['firstNumber', 'firstPenalty', 'firstJam',
                'firstFO', 'firstFOJam', 'benchExpCode', 'benchExpJam']
            let tab = 'penalties'

            for (let i in this.teamList) {
                // For each team

                let team = this.teamList[i]

                // Maximum number of skaters per team
                let maxNum = this.sbTemplate.teams[team].maxNum

                // Read in starting positions for penalty parameters
                cells = this.initCells(team, pstring, tab, props)
                numberAddress.c = cells.firstNumber.c
                penaltyAddress.c = cells.firstPenalty.c
                jamAddress.c = cells.firstJam.c
                foAddress.c = cells.firstFO.c
                foJamAddress.c = cells.firstFOJam.c

                for (let s = 0; s < maxNum; s++) {
                    // For each player

                    // Advance two rows per skater - TODO make this settable?
                    numberAddress.r = cells.firstNumber.r + (s * 2)
                    penaltyAddress.r = cells.firstPenalty.r + (s * 2)
                    jamAddress.r = cells.firstJam.r + (s * 2)
                    foAddress.r = cells.firstFO.r + (s * 2)
                    foJamAddress.r = cells.firstFOJam.r + (s * 2)

                    let skaterNum = sheet[XLSX.utils.encode_cell(numberAddress)]

                    if (skaterNum == undefined || skaterNum.v == '') { continue }

                    // ERROR CHECK: skater on penalty sheet not on the IGRF
                    if (this.sbData.teams[team].persons.findIndex((x: { number: any }) => x.number == skaterNum.v) == -1) {
                        // This SHOULD be caught by conditional formatting in Excel, but there
                        // are reports of that breaking sometimes.
                        this.sbErrors.penalties.penaltiesNotOnIGRF.events.push(
                            `Team: ${this.ucFirst(team)}, Period: ${period}, Skater: ${skaterNum.v} `
                        )
                    }

                    let skater = team + ':' + skaterNum.v

                    for (let p = 0; p < maxPenalties; p++) {
                        // For each penalty space

                        penaltyAddress.c = cells.firstPenalty.c + p
                        jamAddress.c = cells.firstJam.c + p

                        // Read the penalty code and jam number
                        let codeText = sheet[XLSX.utils.encode_cell(penaltyAddress)]
                        let jamText = sheet[XLSX.utils.encode_cell(jamAddress)]

                        let code = _.get(codeText, 'v')
                        let jam = _.get(jamText, 'v')

                        if (code == undefined || jam == undefined) {
                            // Error Check - penalty code without jam # or vice versa

                            if (code == undefined && jam == undefined) {
                                continue
                            } else {
                                this.sbErrors.penalties.codeNoJam.events.push(
                                    `Team: ${this.ucFirst(team)}, Skater: ${skaterNum.v}, Period: ${period}.`
                                )
                                continue
                            }
                        }

                        if (jam > this.sbData.periods[period].jams.length || jam - 1 < 0 || typeof (jam) != 'number') {
                            // Error Check - jam number out of range
                            this.sbErrors.penalties.penaltyBadJam.events.push(
                                `Team: ${this.ucFirst(team)}, Skater: ${skaterNum.v}, Period: ${period}, Recorded Jam: ${jam}`
                            )
                            continue
                        }

                        // Add a penalty event to that jam
                        this.sbData.periods[period].jams[jam - 1].events.push(
                            {
                                event: 'penalty',
                                skater: skater,
                                penalty: code
                            }
                        )
                        this.penalties[skater].push([jam, code])

                    }

                    // Check for FO or EXP, add events
                    let foCode = sheet[XLSX.utils.encode_cell(foAddress)]
                    let foJam = sheet[XLSX.utils.encode_cell(foJamAddress)]
                    let code = _.get(foCode, 'v')
                    let jam = _.get(foJam, 'v')

                    if (foCode == undefined || foJam == undefined) {

                        // Error Check: FO or EXP code without jam, or vice versa.
                        if (foCode != undefined || foJam != undefined) {
                            this.sbErrors.penalties.codeNoJam.events.push(
                                `Team: ${this.ucFirst(team)}, Skater: ${skaterNum.v}, Period: ${period}.`
                            )
                        }

                        // ERROR CHECK: Seven or more penalties with NO foulout entered
                        if (foulouts.indexOf(skater) == -1
                            && this.penalties[skater] != undefined
                            && this.penalties[skater].length > 6
                            && pstring == '2') {
                            this.sbErrors.penalties.sevenWithoutFO.events.push(
                                `Team: ${this.ucFirst(team)}, Skater: ${skaterNum.v}`
                            )
                        }

                        continue
                    }

                    if (typeof (jam) != 'number' ||
                        jam > this.sbData.periods[period].jams.length ||
                        jam - 1 < 0) {
                        this.sbErrors.penalties.foBadJam.events.push(
                            `Team: ${this.ucFirst(team)}, Skater: ${skaterNum.v}, Period: ${period}, Recorded Jam: ${jam}`
                        )
                        continue
                    }

                    // If there is expulsion, add an event.
                    // Note that derbyJSON doesn't actually record foul-outs,
                    // so only expulsions are recorded.
                    if (code != 'FO') {
                        this.sbData.periods[period].jams[jam - 1].events.push(
                            {
                                event: 'expulsion',
                                skater: skater,
                                notes: [
                                    { note: 'Penalty: ' + code },
                                    { note: 'Jam: ' + jam }
                                ]
                            }
                        )
                        this.warningData.expulsions.push(
                            {
                                skater: skater,
                                team: team,
                                period: period,
                                jam: jam
                            }
                        )

                        // ERROR CHECK: Expulsion code for a jam with no penalty
                        if (this.sbData.periods[period].jams[foJam.v - 1].events.filter(
                            (x: { event: string; skater: string }) => x.event == 'penalty' && x.skater == skater
                        ).length < 1) {
                            this.sbErrors.penalties.expulsionNoPenalty.events.push(
                                `Team: ${this.ucFirst(team)}, Period: ${period}, Jam: ${foJam.v}, Skater: ${skaterNum.v}`
                            )
                        }

                        // WARNING CHECK: Expulsion code for a skater with exactly six penalties
                        if (this.penalties[skater].length == 6) {
                            this.sbErrors.warnings.sixPenaltiesPlusExpulsion.events.push(
                                `Team: ${this.ucFirst(team)}, Skater: ${skaterNum.v}`
                            )
                        }

                    }

                    // If there is a foul-out, add an event.
                    if (foCode.v == 'FO') {
                        foulouts.push(skater)
                        this.warningData.foulouts.push(
                            {
                                skater: skater,
                                team: team,
                                period: period,
                                jam: foJam.v
                            }
                        )
                    }

                    // ERROR CHECK: FO entered with fewer than seven penalties
                    if (foCode.v == 'FO' && this.penalties[skater].length < 7) {
                        this.sbErrors.penalties.foUnder7.events.push(
                            `Team: ${this.ucFirst(team)}, Period: ${period}, Skater: ${skaterNum.v}`
                        )
                    }

                }

                // Deal with bench expulsions
                benchExpCodeAddress.r = cells.benchExpCode.r
                benchExpJamAddress.r = cells.benchExpJam.r

                for (let e = 0; e < 2; e++) {
                    benchExpCodeAddress.c = cells.benchExpCode.c + e
                    benchExpJamAddress.c = cells.benchExpJam.c + e

                    let benchExpCode = sheet[XLSX.utils.encode_cell(benchExpCodeAddress)]
                    let benchExpJam = sheet[XLSX.utils.encode_cell(benchExpJamAddress)]

                    if (benchExpCode == undefined || benchExpJam == undefined) {
                        continue
                    }
                    this.sbData.periods[period].jams[benchExpJam.v - 1].events.push(
                        {
                            event: 'expulsion',
                            notes: [
                                { note: 'Bench Staff Expulsion - ' + benchExpCode.v },
                                { note: 'Jam: ' + benchExpJam.v }
                            ]
                        }
                    )


                }
            }
        }

    }

    readLineups = (workbook: { Sheets: { [x: string]: any } }) => {
        // Read in the data from the lineups tab.

        let cells: any = {},
            jamNumberAddress: any = {},
            noPivotAddress: any = {},
            skaterAddress: any = {},
            skaterList: any = [],
            maxJams: any = this.sbTemplate.lineups.maxJams,
            boxCodes: any = this.sbTemplate.lineups.boxCodes,
            sheet = workbook.Sheets[this.sbTemplate.lineups.sheetName],
            positions: Map<number, string> = new Map([
                [0, 'jammer'],
                [1, 'pivot'],
                [2, 'blocker'],
                [3, 'blocker'],
                [4, 'blocker']
            ]),
            box: Record<string, any[]> = { home: [], away: [] },
            tab = 'lineups',
            props = ['firstJamNumber', 'firstNoPivot', 'firstJammer']

        for (let period = 1; period < 3; period++) {
            // For each period

            let pstring = period.toString()

            for (var i in this.teamList) {
                // For each team
                let team = this.teamList[i]
                let jam = 0
                let starPass = false

                cells = this.initCells(team, pstring, tab, props)
                jamNumberAddress.c = cells.firstJamNumber.c
                noPivotAddress.c = cells.firstNoPivot.c
                skaterAddress.c = cells.firstJammer.c

                for (let l = 0; l < maxJams; l++) {
                    // For each line

                    jamNumberAddress.r = cells.firstJamNumber.r + l
                    noPivotAddress.r = cells.firstNoPivot.r + l
                    skaterAddress.r = cells.firstJammer.r + l

                    let jamText = sheet[XLSX.utils.encode_cell(jamNumberAddress)]
                    let noPivot = sheet[XLSX.utils.encode_cell(noPivotAddress)]

                    if (jamText == undefined ||
                        jamText.v == '' ||
                        /^\s+$/.test(jamText.v)) { continue }
                    // If there is no jam number, go on to the next line.
                    // TODO - maybe change this to not give up if the jam # is blank?

                    if (this.anSP.test(jamText.v)) {
                        // If this is a star pass line (SP or SP*)
                        starPass = true

                        if (!this.mySP.test(jamText.v)) {
                            // If this is an opposing team star pass only,
                            // Check for skaters that shouldn't be here, then go on.
                            let spStarSkater = false

                            for (let s = 0; s < 5; s++) {
                                skaterAddress.c = cells.firstJammer.c + (s * (boxCodes + 1))
                                let skaterText = sheet[XLSX.utils.encode_cell(skaterAddress)]
                                if (skaterText != undefined && skaterText.v != false) {
                                    spStarSkater = true
                                }
                            }

                            if (spStarSkater) {
                                this.sbErrors.lineups.spStarSkater.events.push(
                                    `Team: ${this.ucFirst(team)}, Period: ${period}, Jam: ${jam}`
                                )
                            }

                            continue
                        }

                        if (_.get(noPivot, 'v') == undefined) {
                            // Error check: Star Pass line without "No Pivot" box checked.

                            this.sbErrors.lineups.starPassNoPivot.events.push(
                                `Team: ${this.ucFirst(team)}, Period: ${period}, Jam: ${jam}`
                            )
                        }
                    } else if (this.anINJ.test(jamText.v)) {
                        // If this is an injury line (INJ or INJ*)
                        // TODO: add an error check to see if skaters
                        // other than the jammer were subbed.
                        continue
                    } else {
                        // Not a starpass or an injury line, update the jam number
                        jam = jamText.v
                        starPass = false
                        skaterList = []
                    }

                    // Retrieve penalties from this jam and prior jam for
                    // error checking later
                    let thisJamPenalties = this.sbData.periods[pstring].jams[jam - 1].events.filter(
                        (x: { event: string; skater: string }) => (x.event == 'penalty' && x.skater.substr(0, 4) == team)
                    )
                    let priorJamPenalties = []
                    if (jam != 1) {
                        priorJamPenalties = this.sbData.periods[pstring].jams[jam - 2].events.filter(
                            (x: { event: string; skater: string }) => (x.event == 'penalty' && x.skater.substr(0, 4) == team)
                        )
                    } else if (period == 2) {
                        priorJamPenalties = this.sbData.periods['1'].jams[
                            this.sbData.periods['1'].jams.length - 1
                        ].events.filter(
                            (x: { event: string; skater: string }) => (x.event == 'penalty' && x.skater.substr(0, 4) == team)
                        )
                    }

                    for (let s = 0; s < 5; s++) {
                        // For each skater
                        let position = ''

                        skaterAddress.c = cells.firstJammer.c + (s * (boxCodes + 1))
                        let skaterText = sheet[XLSX.utils.encode_cell(skaterAddress)]

                        if (skaterText == undefined ||
                            (skaterText.v == undefined ||
                                skaterText.v == '?' ||
                                skaterText.v == 'n/a' ||
                                skaterText.v == 'N/A')
                        ) {
                            if (skaterText == undefined || (skaterText.v == undefined && skaterText.c == undefined)) {
                                // WARNING: Empty box on Lineups without comment
                                this.sbErrors.warnings.emptyLineupNoComment.events.push(
                                    `Team: ${this.ucFirst(team)}, Period: ${period}, Jam: ${jam}, Column: ${s + 1}`
                                )
                            }
                            continue
                        }

                        let skater = team + ':' + skaterText.v

                        // ERROR CHECK: Skater on lineups not on IGRF
                        if (this.sbData.teams[team].persons.findIndex((x: { number: any }) => x.number == skaterText.v) == -1) {
                            // If the skater is not on the IGRF, record an error.
                            // This SHOULD be caught by conditional formatting in Excel, but there
                            // are reports of that breaking sometimes.
                            this.sbErrors.lineups.lineupsNotOnIGRF.events.push(
                                `Team: ${this.ucFirst(team)}, Period: ${period}, Jam: ${jam}, Skater: ${skaterText.v} `
                            )
                        }

                        // ERROR CHECK: Same skater entered more than once per jam
                        if (skaterList.indexOf(skater) != -1 && !starPass) {
                            this.sbErrors.lineups.samePlayerTwice.events.push(
                                `Team: ${this.ucFirst(team)}, Period: ${period}, Jam: ${jam}, Skater: ${skaterText.v}`
                            )
                        }

                        if (!starPass) { skaterList.push(skater) }

                        if (s == 1 && noPivot != undefined && noPivot.v != undefined) {
                            position = 'blocker'
                        } else {
                            position = positions.get(s) ?? "unknown"
                        }

                        if (!starPass) {
                            // Unless this is a star pass, add a
                            //"lineup" event for that skater with the position
                            this.sbData.periods[pstring].jams[jam - 1].events.push(
                                {
                                    event: 'lineup',
                                    skater: skater,
                                    position: position
                                }
                            )

                        }

                        let allCodes = ''
                        // Add box codes if present
                        for (let c = 1; c <= boxCodes; c++) {
                            // for each code box

                            skaterAddress.c = cells.firstJammer.c + (s * (boxCodes + 1)) + c
                            let codeText = sheet[XLSX.utils.encode_cell(skaterAddress)]

                            if (codeText == undefined || /^\s*$/.exec(codeText.v)) { continue }

                            allCodes += codeText.v

                            switch (this.sbVersion) {
                                case '2017':
                                case '2018':
                                    // Possible codes - /, X, S, $, I or |, 3
                                    // Possible events - enter box, exit box, injury
                                    // / - Enter box
                                    // X - Test to see if skater is IN box
                                    //      Yes: exit box, No: enter box, exit box
                                    // S - Enter box, note: sat between jams
                                    // $ - Enter box, exit box, note: sat between jams
                                    // I or | - no event, error checking only
                                    // 3 - Injury object, verify not already present from score tab

                                    switch (codeText.v) {
                                        case '/':
                                            // Add an "Enter Box" event, and push the skater onto the box list
                                            this.enterBox(pstring, jam, skater)
                                            box[`${team}`].push(skater)

                                            // ERROR CHECK: Skater enters the box during the jam
                                            // without a penalty in the current jam.
                                            if (thisJamPenalties.find(
                                                (x: { skater: string }) => x.skater == skater
                                            ) == undefined) {
                                                this.sbErrors.lineups.slashNoPenalty.events.push(
                                                    `Team: ${this.ucFirst(team)}, Period: ${pstring}, Jam: ${jam}, Skater: ${skaterText.v}`
                                                )
                                            }
                                            break
                                        case 'ᚾ':
                                            // Error Check: Using the rune instead of an X
                                            this.sbErrors.lineups.runeUsed.events.push(
                                                `Team: ${this.ucFirst(team)}, Period: ${pstring}, Jam: ${jam}`
                                            )
                                        //break omitted
                                        case 'X':
                                        case 'x':
                                            if (!box[team].includes(skater)) {
                                                // If the skater is not in the box, add an "enter box" event
                                                this.enterBox(pstring, jam, skater)

                                                // ERROR CHECK: Skater enters the box during the jam
                                                // without a penalty in the current jam.
                                                if (thisJamPenalties.find(
                                                    (x: { skater: string }) => x.skater == skater
                                                ) == undefined) {
                                                    this.sbErrors.lineups.xNoPenalty.events.push(
                                                        `Team: ${this.ucFirst(team)}, Period: ${pstring}, Jam: ${jam}, Skater: ${skaterText.v}`
                                                    )
                                                    this.warningData.badContinues.push({
                                                        skater: skater,
                                                        team: team,
                                                        period: period,
                                                        jam: jam
                                                    })
                                                }

                                            }
                                            // Whether or not the skater started in the box, add an "exit box" event
                                            this.exitBox(pstring, jam, skater)

                                            // Remove the skater from the box list.
                                            if (box[team].includes(skater)) {
                                                this.remove(box[team], skater)
                                            }
                                            break

                                        case 'S':
                                        case 's':
                                            // Add a box entry, with a note that the skater sat between jams.
                                            this.enterBox(pstring, jam, skater, 'Sat Between Jams.')

                                            // ERROR CHECK: Skater starts in the box while already in the box.
                                            if (box[team].includes(skater)) {
                                                this.sbErrors.lineups.startsWhileThere.events.push(
                                                    `Team: ${this.ucFirst(team)}, Period: ${pstring}, Jam: ${jam}, Skater: ${skaterText.v}`
                                                )
                                            } else {
                                                // Add skater to the box list.
                                                box[team].push(skater)
                                            }

                                            // ERROR CHECK: Skater starts in the box without a penalty
                                            // in the prior or current jam.
                                            if (thisJamPenalties.find((x: { skater: string }) => x.skater == skater) == undefined
                                                && priorJamPenalties.find((x: { skater: string }) => x.skater == skater) == undefined) {
                                                this.sbErrors.lineups.sNoPenalty.events.push(
                                                    `Team: ${this.ucFirst(team)}, Period: ${pstring}, Jam: ${jam}, Skater: ${skaterText.v}`
                                                )
                                                this.warningData.badStarts.push({
                                                    skater: skater,
                                                    team: team,
                                                    period: period,
                                                    jam: jam
                                                })
                                            }
                                            break

                                        case '$':
                                            this.enterBox(pstring, jam, skater, 'Sat Between Jams.')
                                            this.exitBox(pstring, jam, skater)

                                            // ERROR CHECK: Skater starts in the box while already in the box.
                                            if (box[team].includes(skater)) {
                                                this.sbErrors.lineups.startsWhileThere.events.push(
                                                    `Team: ${this.ucFirst(team)}, Period: ${pstring}, Jam: ${jam}, Skater: ${skaterText.v}`
                                                )
                                                this.remove(box[team], skater)
                                            }

                                            // ERROR CHECK: Skater starts in the box without a penalty
                                            // in the prior or current jam.
                                            if (thisJamPenalties.find((x: { skater: string }) => x.skater == skater) == undefined
                                                && priorJamPenalties.find((x: { skater: string }) => x.skater == skater) == undefined) {
                                                this.sbErrors.lineups.sSlashNoPenalty.events.push(
                                                    `Team: ${this.ucFirst(team)}, Period: ${pstring}, Jam: ${jam}, Skater: ${skaterText.v}`
                                                )
                                                this.warningData.badStarts.push({
                                                    skater: skater,
                                                    team: team,
                                                    period: period,
                                                    jam: jam
                                                })
                                            }

                                            break
                                        case 'I':
                                        case '|':
                                            // no derbyJSON event, but use this branch for error checking
                                            if (!box[team].includes(skater)) {
                                                let priorFoulout = this.warningData.foulouts.filter((x: { period: number; jam: number; skater: string }) =>
                                                    (x.period == period && x.jam < jam && x.skater == skater) ||
                                                    (x.period < period && x.skater == skater))
                                                if (priorFoulout.length > 0) {
                                                    this.sbErrors.lineups.foInBox.events.push(
                                                        `Team: ${this.ucFirst(team)}, Period: ${pstring}, Jam: ${jam}, Skater: ${skaterText.v}`
                                                    )
                                                } else {
                                                    this.sbErrors.lineups.iNotInBox.events.push(
                                                        `Team: ${this.ucFirst(team)}, Period: ${pstring}, Jam: ${jam}, Skater: ${skaterText.v}`
                                                    )
                                                }
                                                this.warningData.badContinues.push({
                                                    skater: skater,
                                                    team: team,
                                                    period: period,
                                                    jam: jam
                                                })
                                            }
                                            break
                                        case '3':
                                        case 3:
                                            // Since '3' does not necessarily mean the jam was called, not enough information
                                            // here to conclusively record a derbyJSON injury event, which specifies that the
                                            // jam was called for injury.   However, save the skater information for error
                                            // checking later.
                                            this.warningData.lineupThree.push({
                                                skater: skater,
                                                team: team,
                                                period: period,
                                                jam: jam
                                            })

                                            // remove the injured skater from the box if they were there
                                            if (box[team].includes(skater)) {
                                                this.remove(box[team], skater)
                                            }
                                            break
                                        default:
                                            // Handle invalid lineup codes
                                            this.sbErrors.lineups.badLineupCode.events.push(
                                                `Team: ${this.ucFirst(team)}, Period: ${pstring}, Jam: ${jam}, Skater: ${skaterText.v}, Code: ${codeText.v}`
                                            )
                                            break
                                    }
                                    break
                                case '2019':
                                case '2023jrda':
                                case '2024jrda':
                                    // Possible codes - -, +, S, $, 3

                                    // - - Enter box
                                    // + - Enter and exit box
                                    // S - Sat between jams or continued
                                    // $ - Sat between jams or continued with exit
                                    // 3 - Injury object, verify not already present from score tab

                                    switch (codeText.v) {
                                        case '-':
                                            // Add an "Enter Box" event, and push the skater onto the box list
                                            this.enterBox(pstring, jam, skater)
                                            box[team].push(skater)

                                            // ERROR CHECK: Skater enters the box during the jam
                                            // without a penalty in the current jam.
                                            if (thisJamPenalties.find(
                                                (x: { skater: string }) => x.skater == skater
                                            ) == undefined) {
                                                this.sbErrors.lineups.dashNoPenalty.events.push(
                                                    `Team: ${this.ucFirst(team)}, Period: ${pstring}, Jam: ${jam}, Skater: ${skaterText.v}`
                                                )
                                            }
                                            break
                                        case '+':

                                            this.enterBox(pstring, jam, skater)
                                            this.exitBox(pstring, jam, skater)

                                            // ERROR CHECK: Skater enters the box during the jam
                                            // without a penalty in the current jam.
                                            if (thisJamPenalties.find(
                                                (x: { skater: string }) => x.skater == skater
                                            ) == undefined) {
                                                this.sbErrors.lineups.plusNoPenalty.events.push(
                                                    `Team: ${this.ucFirst(team)}, Period: ${pstring}, Jam: ${jam}, Skater: ${skaterText.v}`
                                                )
                                            }

                                            break

                                        case 'S':
                                        case 's': {

                                            // ERROR CHECK: skater who has fouled out starting in box
                                            let priorFoulout = this.warningData.foulouts.filter((x: { period: number; jam: number; skater: string }) =>
                                                (x.period == period && x.jam < jam && x.skater == skater) ||
                                                (x.period < period && x.skater == skater))
                                            if (priorFoulout.length > 0) {
                                                this.sbErrors.lineups.foInBox.events.push(
                                                    `Team: ${this.ucFirst(team)}, Period: ${pstring}, Jam: ${jam}, Skater: ${skaterText.v}`
                                                )
                                            }

                                            if (!box[team].includes(skater)) {
                                                // If the skater is not already in the box:

                                                // ERROR CHECK: Skater starts in the box without a penalty
                                                // in the prior or current jam.
                                                if (thisJamPenalties.find((x: { skater: string }) => x.skater == skater) == undefined
                                                    && priorJamPenalties.find((x: { skater: string }) => x.skater == skater) == undefined) {
                                                    this.sbErrors.lineups.sNoPenalty.events.push(
                                                        `Team: ${this.ucFirst(team)}, Period: ${pstring}, Jam: ${jam}, Skater: ${skaterText.v}`
                                                    )
                                                    this.warningData.badStarts.push({
                                                        skater: skater,
                                                        team: team,
                                                        period: period,
                                                        jam: jam
                                                    })
                                                }

                                                // Add a box entry, and add the skater to the box list
                                                this.enterBox(pstring, jam, skater, 'Sat Between Jams.')
                                                box[team].push(skater)
                                            }

                                            break
                                        }
                                        case '$': {
                                            // ERROR CHECK: skater who has fouled out starting in box
                                            let priorFoulout = this.warningData.foulouts.filter((x: { period: number; jam: number; skater: string }) =>
                                                (x.period == period && x.jam < jam && x.skater == skater) ||
                                                (x.period < period && x.skater == skater))
                                            if (priorFoulout.length > 0) {
                                                this.sbErrors.lineups.foInBox.events.push(
                                                    `Team: ${this.ucFirst(team)}, Period: ${pstring}, Jam: ${jam}, Skater: ${skaterText.v}`
                                                )
                                            }

                                            if (!box[team].includes(skater)) {
                                                // If the skater is not already in the box:

                                                // ERROR CHECK: Skater starts in the box without a penalty
                                                // in the prior or current jam.
                                                if (thisJamPenalties.find((x: { skater: string }) => x.skater == skater) == undefined
                                                    && priorJamPenalties.find((x: { skater: string }) => x.skater == skater) == undefined) {
                                                    this.sbErrors.lineups.sSlashNoPenalty.events.push(
                                                        `Team: ${this.ucFirst(team)}, Period: ${pstring}, Jam: ${jam}, Skater: ${skaterText.v}`
                                                    )
                                                    this.warningData.badStarts.push({
                                                        skater: skater,
                                                        team: team,
                                                        period: period,
                                                        jam: jam
                                                    })
                                                }

                                                // Add a box entry, and add the skater to the box list
                                                this.enterBox(pstring, jam, skater, 'Sat Between Jams.')
                                                this.exitBox(pstring, jam, skater)
                                            } else {
                                                this.exitBox(pstring, jam, skater)
                                                this.remove(box[team], skater)
                                            }

                                            break
                                        }
                                        case '3':
                                        case 3:
                                            // Since '3' does not necessarily mean the jam was called, not enough information
                                            // here to conclusively record a derbyJSON injury event, which specifies that the
                                            // jam was called for injury.   However, save the skater information for error
                                            // checking later.
                                            this.warningData.lineupThree.push({
                                                skater: skater,
                                                team: team,
                                                period: period,
                                                jam: jam
                                            })

                                            // remove the injured skater from the box if they were there
                                            if (box[team].includes(skater)) {
                                                this.remove(box[team], skater)
                                            }
                                            break
                                        default:
                                            // Handle invalid lineup codes
                                            this.sbErrors.lineups.badLineupCode.events.push(
                                                `Team: ${this.ucFirst(team)}, Period: ${pstring}, Jam: ${jam}, Skater: ${skaterText.v}, Code: ${codeText.v}`
                                            )
                                            break
                                    }
                                    break
                                default:
                                    // Handle unrecognized  statsbook versions?
                                    break
                            }
                        }
                        // Done reading all codes

                        // ERROR CHECK: is this skater still in the box without
                        // any code on the present line?
                        if (box[team].includes(skater) && !allCodes) {
                            this.sbErrors.lineups.seatedNoCode.events.push(
                                `Team: ${this.ucFirst(skater.substr(0, 4))
                                }, Period: ${pstring}, Jam: ${jam}, Skater: ${skater.slice(5)}`
                            )
                            this.warningData.noExits.push({
                                skater: skater,
                                team: team,
                                period: period,
                                jam: jam
                            })
                            this.remove(box[team], skater)
                        }
                        // Done processing skater

                    }
                    // Done reading line

                    // Remove fouled out or expelled skaters from the box
                    let fouledOutSkaters = this.warningData.foulouts.filter((x: { period: number; jam: number; team: any }) => x.period == period && x.jam == jam && x.team == team)
                    if (fouledOutSkaters != undefined) {
                        for (let s in fouledOutSkaters) {
                            let skater = fouledOutSkaters[s].skater
                            if (box[team].includes(skater)) {
                                this.remove(box[team], skater)
                            }
                        }
                    }
                    let expelledSkaters = this.warningData.expulsions.filter((x: { period: number; jam: number; team: any }) => x.period == period && x.jam == jam && x.team == team)
                    if (expelledSkaters != undefined) {
                        for (let s in expelledSkaters) {
                            let skater = expelledSkaters[s].skater
                            if (box[team].includes(skater)) {
                                this.remove(box[team], skater)
                            }
                        }
                    }

                    // Error Check: Skater still in the box not listed on lineup tab at all
                    for (let s in box[team]) {
                        let skater = box[team][s]
                        if (!skaterList.includes(skater)) {
                            this.sbErrors.lineups.seatedNotLinedUp.events.push(
                                `Team: ${this.ucFirst(skater.substr(0, 4))
                                }, Period: ${pstring}, Jam: ${jam}, Skater: ${skater.slice(5)}`
                            )
                            this.warningData.noExits.push({
                                skater: skater,
                                team: team,
                                period: period,
                                jam: jam
                            })
                        }
                    }

                    // ERROR CHECK: Skaters with penalties in this jam not listed on the lineup tab
                    for (let p in thisJamPenalties) {
                        if (skaterList.indexOf(thisJamPenalties[p].skater) == -1) {
                            this.sbErrors.penalties.penaltyNoLineup.events.push(
                                `Team: ${this.ucFirst(thisJamPenalties[p].skater.substr(0, 4))
                                }, Period: ${pstring}, Jam: ${jam}, Skater: ${thisJamPenalties[p].skater.slice(5)}`
                            )
                        }
                    }
                }

            }
        }

    }

    cellVal = (sheet: { [x: string]: { v: any } }, address: string | number) => {
        // Given a worksheet and a cell address, return the value
        // in the cell if present, and undefined if not.
        if (sheet[address] && sheet[address].v) {
            return sheet[address].v
        } else {
            return undefined
        }
    }

    initCells = (team: string | number, period: string, tab: string, props: any[]) => {
        // Given a team, period, SB section, and list of properties,
        // return an object of addresses for those properties.
        // Team should be 'home' or 'away'
        let cells: any = {}

        for (let i in props) {
            cells[props[i]] = XLSX.utils.decode_cell(
                this.sbTemplate[tab][period][team][props[i]])
        }

        return cells
    }

    enterBox = (pstring: string, jam: number, skater: string, note?: string) => {
        // Add an 'enter box' event
        let event = {
            event: 'enter box',
            skater: skater,
            note: 'undefined'
        }

        if (note !== undefined) {
            event.note = note
        }

        this.sbData.periods[pstring].jams[jam - 1].events.push(event)

    }

    exitBox = (pstring: string, jam: number, skater: string) => {
        // Add an 'exit box' event
        this.sbData.periods[pstring].jams[jam - 1].events.push(
            {
                event: 'exit box',
                skater: skater
            }
        )
    }

    remove = (array: any[], element: string) => {
        // Lifted from https://blog.mariusschulz.com/
        // Removes an element from an arry
        const index = array.indexOf(element)

        if (index !== -1) {
            array.splice(index, 1)
        }
    }

    ucFirst = (string: string) => {
        // Capitalize first character of a string
        return string.charAt(0).toUpperCase() + string.slice(1)
    }

    errorCheck = () => {
        // Run error checks that occur after all data has been read

        let jams = 0,
            events = [],
            pstring = ''

        for (let period = 1; period <= Object.keys(this.sbData.periods).length; period++) {

            pstring = period.toString()
            jams = this.sbData.periods[pstring].jams.length

            for (var jam = 1; jam <= jams; jam++) {
                events = this.sbData.periods[pstring].jams[jam - 1].events

                // Get the list of Penalties in this jam
                let thisJamPenalties = events.filter(
                    (x: { event: string }) => x.event == 'penalty'
                )

                // Get lead jammer if present (will only catch FIRST if two are marked)
                let leadJammer = ''
                let leadEvent = events.filter((x: { event: string }) => x.event == 'lead')
                if (leadEvent.length != 0) {
                    leadJammer = leadEvent[0].skater
                }

                // Get the list of box entires in the current jam and the next one
                let thisJamEntries = events.filter(
                    (x: { event: string }) => x.event == 'enter box'
                )
                let nextJamEntries = []
                if (period == 1 && jam == (jams)) {
                    // If this is the last jam of the 1st period, get period 2, jam 1
                    try {
                        nextJamEntries = this.sbData.periods['2'].jams[0].events.filter(
                            (x: { event: string }) => x.event == 'enter box'
                        )
                    } catch (e) {
                        nextJamEntries = []
                    }
                } else if (jam != (jams)) {
                    // Otherwise, just grab the next jam (don't forget 0 indexing)
                    nextJamEntries = this.sbData.periods[pstring].jams[jam].events.filter(
                        (x: { event: string }) => x.event == 'enter box'
                    )
                }   // Last jam of the 2nd period gets ignored.

                //ERROR CHECK: Penalty without box entry in this jam
                //or the following jam.
                for (let pen in thisJamPenalties) {
                    if (thisJamEntries.filter(
                        (x: { skater: any }) => x.skater == thisJamPenalties[pen].skater
                    ).length == 0 && nextJamEntries.filter(
                        (x: { skater: any }) => x.skater == thisJamPenalties[pen].skater
                    ).length == 0) {
                        if (!(jam == jams && period == 2)) {
                            this.sbErrors.penalties.penaltyNoEntry.events.push(
                                `Team: ${this.ucFirst(thisJamPenalties[pen].skater.substr(0, 4))
                                }, Period: ${period}, Jam: ${jam}, Skater: ${thisJamPenalties[pen].skater.slice(5)}`
                            )
                        } else {
                            this.sbErrors.warnings.lastJamNoEntry.events.push(
                                `Team: ${this.ucFirst(thisJamPenalties[pen].skater.substr(0, 4))
                                }, Period: 2, Jam: ${jam}, Skater: ${thisJamPenalties[pen].skater.slice(5)}`
                            )
                        }
                        this.warningData.noEntries.push({
                            skater: thisJamPenalties[pen].skater,
                            team: thisJamPenalties[pen].skater.substr(0, 4),
                            period: period,
                            jam: jam
                        })
                    }
                }

                //Warning check: Jammer with lead and penalty, but not lost
                if (leadJammer != ''
                    && thisJamPenalties.filter((x: { skater: string }) => x.skater == leadJammer).length != 0
                    && events.filter((x: { event: string; skater: string }) => x.event == 'lost' && x.skater == leadJammer).length == 0
                ) {
                    this.sbErrors.warnings.leadPenaltyNotLost.events.push(
                        `Team: ${this.ucFirst(leadJammer.substr(0, 4))
                        }, Period: ${period}, Jam: ${jam}, Jammer: ${leadJammer.slice(5)}`
                    )
                }
            }
        }
    }

    warningCheck = () => {
        // Run checks for things that should throw warnings but not errors.

        // Warning check: Possible substitution.
        // For each skater who has a $ or S without a corresponding penalty,
        // check to see if a different skater on the same team has
        // a penalty without a subsequent box exit.
        for (let event in this.warningData.badStarts) {
            let bs = this.warningData.badStarts[event]
            if (this.warningData.noEntries.filter(
                (ne: { team: any; period: number; jam: number }) => (ne.team == bs.team &&
                    (
                        (ne.period == bs.period && ne.jam == (bs.jam - 1)) ||
                        (ne.period == (bs.period - 1) && bs.jam == 1)
                    )
                )).length >= 1) {
                if (bs.jam != 1) {
                    this.sbErrors.warnings.possibleSub.events.push(
                        `Team: ${this.ucFirst(bs.team)}, Period: ${bs.period
                        }, Jams: ${bs.jam - 1} & ${bs.jam}`
                    )
                } else {
                    this.sbErrors.warnings.possibleSub.events.push(
                        `Team: ${this.ucFirst(bs.team)}, Period: 1, Jam: ${this.sbData.periods['1'].jams.length
                        } & Period: 2, Jam: ${bs.jam}`
                    )
                }
            }
        }

        // Warning check: Possible substitution.
        // For each skater who has a I, |, X or x without a corresponding penalty,
        // check to see if a different skater on the same team has
        // a penalty without a subsequent box exit.

        for (let event in this.warningData.badContinues) {
            // For each skater who is on the "continued without entry" list
            let bc = this.warningData.badContinues[event]

            // If there's a corresponding entry on the "never exited the box list", issue a warning
            if (this.warningData.noExits.filter(
                (ne: { team: any; period: any; jam: any }) => (ne.team == bc.team &&
                    (
                        (ne.period == bc.period && ne.jam == bc.jam)
                    )
                )).length >= 1) {
                if (bc.jam != 1) {
                    this.sbErrors.warnings.possibleSub.events.push(
                        `Team: ${this.ucFirst(bc.team)}, Period: ${bc.period
                        }, Jams: ${bc.jam - 1} & ${bc.jam}`
                    )
                } else {
                    this.sbErrors.warnings.possibleSub.events.push(
                        `Team: ${this.ucFirst(bc.team)}, Period: 1, Jam: ${this.sbData.periods['1'].jams.length
                        } & Period: 2, Jam: ${bc.jam}`
                    )
                }
            }

            // If there's a skater in the prior jam with a foulout, issue a warning as well
            if (this.warningData.foulouts.filter(
                (fo: { team: any; period: any; jam: number }) => fo.team == bc.team &&
                    (
                        (fo.period == bc.period && fo.jam == bc.jam - 1) ||
                        (bc.period == 2 && bc.jam == 1 && fo.jam == this.sbData.periods['1'].jams.length)
                    )
            ).length > 0) {
                if (bc.jam != 1) {
                    this.sbErrors.warnings.possibleSub.events.push(
                        `Team: ${this.ucFirst(bc.team)}, Period: ${bc.period
                        }, Jams: ${bc.jam - 1} & ${bc.jam}`
                    )
                } else {
                    this.sbErrors.warnings.possibleSub.events.push(
                        `Team: ${this.ucFirst(bc.team)}, Period: 1, Jam: ${this.sbData.periods['1'].jams.length
                        } & Period: 2, Jam: ${bc.jam}`
                    )
                }
            }

            // If there's a skater in the prior jam with an expulsion, issue a warning as well
            if (this.warningData.expulsions.filter(
                (exp: { team: any; period: any; jam: number }) => exp.team == bc.team &&
                    (
                        (exp.period == bc.period && exp.jam == bc.jam - 1) ||
                        (bc.period == 2 && bc.jam == 1 && exp.jam == this.sbData.periods['1'].jams.length)
                    )
            ).length > 0) {
                if (bc.jam != 1) {
                    this.sbErrors.warnings.possibleSub.events.push(
                        `Team: ${this.ucFirst(bc.team)}, Period: ${bc.period
                        }, Jams: ${bc.jam - 1} & ${bc.jam}`
                    )
                } else {
                    this.sbErrors.warnings.possibleSub.events.push(
                        `Team: ${this.ucFirst(bc.team)}, Period: 1, Jam: ${this.sbData.periods['1'].jams.length
                        } & Period: 2, Jam: ${bc.jam}`
                    )
                }
            }

        }

        // Warning Check - lost lead without a penalty
        for (let s in this.warningData.lost) {
            let lost = this.warningData.lost[s]
            if (this.sbData.periods[lost.period].jams[lost.jam - 1].events.filter(
                (event: { skater: any; event: string }) => event.skater == lost.skater && event.event == 'penalty'
            ).length == 0) {
                this.sbErrors.warnings.lostNoPenalty.events.push(
                    `Team: ${this.ucFirst(lost.team)}, Period: ${lost.period
                    }, Jam: ${lost.jam}, Skater: ${lost.skater.slice(5)}`
                )
            }
        }

        // Warning Check - jam called for injury without a skater marked with a "3"
        // Note: filtered for home team to prevent duplicate errors.
        for (let j in this.warningData.jamsCalledInjury) {
            let injJam = this.warningData.jamsCalledInjury[j]
            if (!this.warningData.lineupThree.find((x: { jam: any }) => x.jam == injJam.jam)) {
                this.sbErrors.warnings.injNoThree.events.push(
                    `Period: ${injJam.period}, Jam: ${injJam.jam}`
                )
            }
        }
        // Remove duplicates
        this.sbErrors.warnings.injNoThree.events = this.sbErrors.warnings.injNoThree.events.filter(
            (v: any, i: any, a: string | any[]) => a.indexOf(v) === i
        )

    }

}

// localInit();
// function localInit() {
//     console.log("Making reader")
//     let data = fs.readFileSync("C:\\Users\\David\\source\\repos\\roller-stats\\roller-stats-inf\\code\\statbook.xlsx")
//     data = new Uint8Array(data)
//     const converter = new WFTDAStatbookConverter();
//     converter.convertToJson(data);
// }



export { WFTDAStatbookConverter }