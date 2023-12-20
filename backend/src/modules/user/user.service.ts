import { registerDto } from "./dto/register.dto";
import prisma from "../prisma/prisma.client";
import { users } from "@prisma/client";
import { generateRandomPassword, hashPassword } from "../../utils/password";

export default class userService {
  createUserSteam = async (register: registerDto) => {
    const user = await this.findUserBySteamId(register.steamid)
    if (!user) {
      const password = generateRandomPassword(10)
      console.log(password)
      await prisma.users.create({
        data: {
          steamID: register.steamid,
          password: await hashPassword(password)
        }
      })
      const usr = await this.findUserBySteamId(register.steamid)
      return usr
    }
  }
  findUserBySteamId = async (steamid: string): Promise<any | null> => {
    const user = await prisma.users.findFirst({
      where: {
        steamID: steamid
      },
      select: {
        steamID: true,
        id: true,
        rank: true
      }
    });
    return user;
  };
  getUser = async (steamid: string): Promise<users | null> => {
    return await prisma.users.findFirst({
      where: {
        steamID: steamid
      }
    })
  }
  updateRank = async (steamId: string, winner: boolean) => {
    const ranksum = 30;
    const usr = await this.getUser(steamId);

    if (usr) {
      let newRank = usr.rank;
      if (winner) {
        newRank += ranksum;
      } else {
        newRank -= ranksum;
      }
      await prisma.users.update({
        where: {
          id: usr.id,
        },
        data: {
          rank: newRank,
        },
      });
    }
  };
  addUserToLobby = async (userId: string, gameId: string) => {
    const usr = await prisma.users.update({
      where: {
        id: userId
      },
      data: {
        tLobbies: {
          connect: {
            id: gameId
          }
        }
      },
      select: {
        id: true,
        partyLeader: {
          select: {
            members: true
          }
        }
      }
    })
    if (usr.partyLeader) {
      for (const users of usr.partyLeader.members) {
        await prisma.users.update({
          where: {
            id: users.id
          },
          data: {
            tLobbies: {
              connect: {
                id: gameId
              }
            }
          },
        })
      }
    }
    return {
      success: true
    }
  }
  leaveLobby = async(userId: string,gameId: string)=> {
    const usr = await prisma.users.update({
      where: {
        id: userId
      },
      data: {
        ctLobbies: {
          disconnect: {
            id: gameId
          }
        },
        tLobbies: {
            disconnect: {
              id: gameId
            }
        }
      },
      select: {
        id: true,
        partyLeader: {
          select: {
            id: true,
            members: true
          }
        }
      }
    })
    if(usr.partyLeader?.members) {
      for (const users of usr.partyLeader.members) {
        await prisma.users.update({
          where: {
            id: users.id
          },
          data: {
            ctLobbies: {
              disconnect: {
                id: gameId
              }
            },
            tLobbies: {
                disconnect: {
                  id: gameId
                }
            }
          },
        })
      }
    }
  }
  dissassembleParty = async (userId: string) => {
    const usr = await prisma.users.update({
      where: {
        id: userId
      },
      data: {
        partyLeader: {
          disconnect: true
        }
      },
      select: {
        id: true,
        partyLeader: {
          select: {
            id: true,
            members: true
          }
        }
      }
    })
    if(usr.partyLeader?.members) {
      for (const users of usr.partyLeader.members) {
        await prisma.users.update({
          where: {
            id: users.id
          },
          data: {
            partyMember: {
              disconnect: true
            }
          },
        })
      }
    }
  }
  switchTeam = async (userId: string, lobbyId: string) => {
    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
      include: {
        ctLobbies: true,
        tLobbies: true
      }
    });

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    const lobby = await prisma.lobby.findUnique({
      where: {
        id: lobbyId,
      },
    });

    if (!lobby) {
      return {
        success: false,
        message: 'Lobby not found',
      };
    }

    const isInCTLobby = !!user.ctLobbies.find((ctLobby) => ctLobby.id === lobbyId);
    const isInTLobby = !!user.tLobbies.find((tLobby) => tLobby.id === lobbyId);

    if (isInCTLobby) {
      await prisma.users.update({
        where: {
          id: userId,
        },
        data: {
          ctLobbies: {
            disconnect: {
              id: lobbyId,
            },
          },
          tLobbies: {
            connect: {
              id: lobbyId,
            },
          },
        },
      });

      return {
        success: true,
        message: 'Switched from CT to T in the specified lobby',
      };
    } else if (isInTLobby) {
      await prisma.users.update({
        where: {
          id: userId,
        },
        data: {
          tLobbies: {
            disconnect: {
              id: lobbyId,
            },
          },
          ctLobbies: {
            connect: {
              id: lobbyId,
            },
          },
        },
      });

      return {
        success: true,
        message: 'Switched from T to CT in the specified lobby',
      };
    } else {
      return {
        success: false,
        message: 'User is not in the specified lobby or is in the opposite team',
      };
    }
  };
  joinTeam = async (userId: string, LobbyId: string, team: "T" | "CT") => {
    switch (team) {
      case "T":
        await prisma.users.update({
          where: {
            id: userId
          },
          data: {
            tLobbies: {
              connect: {
                id: LobbyId
              }
            }
          }
        })
        break;

      case "CT":
        await prisma.users.update({
          where: {
            id: userId
          },
          data: {
            ctLobbies: {
              connect: {
                id: LobbyId
              }
            }
          }
        })
        break;
    }


  }

}