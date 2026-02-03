
import { User, Project, MicroContract, Conversation, Message, ContractStatus } from './types';

class MadeDB {
  private static instance: MadeDB;
  private STORAGE_KEY = 'made_vault_v1';

  private constructor() {}

  public static getInstance(): MadeDB {
    if (!MadeDB.instance) {
      MadeDB.instance = new MadeDB();
    }
    return MadeDB.instance;
  }

  private getData() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : {
      users: [],
      projects: [],
      contracts: [],
      conversations: [],
      invites: ['AUC-2024', 'GUC-ELITE', 'SHIP-FAST', 'BETA-MADE']
    };
  }

  private saveData(data: any) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  public getProjects(): Project[] {
    return this.getData().projects;
  }

  public getUsers(): User[] {
    return this.getData().users;
  }

  public getContracts(): MicroContract[] {
    return this.getData().contracts;
  }

  public getConversations(): Conversation[] {
    return this.getData().conversations;
  }

  public saveUser(user: User) {
    const data = this.getData();
    const existing = data.users.findIndex((u: User) => u.id === user.id);
    if (existing >= 0) data.users[existing] = user;
    else data.users.push(user);
    this.saveData(data);
  }

  public addProject(project: Project) {
    const data = this.getData();
    data.projects.unshift(project);
    this.saveData(data);
  }

  public addComment(projectId: string, comment: any) {
    const data = this.getData();
    const pIdx = data.projects.findIndex((p: Project) => p.id === projectId);
    if (pIdx >= 0) {
      data.projects[pIdx].comments.unshift(comment);
      this.saveData(data);
    }
  }

  public updateContract(contractId: string, updates: Partial<MicroContract>) {
    const data = this.getData();
    const cIdx = data.contracts.findIndex((c: MicroContract) => c.id === contractId);
    if (cIdx >= 0) {
      data.contracts[cIdx] = { ...data.contracts[cIdx], ...updates };
      this.saveData(data);
    }
  }

  public addContract(contract: MicroContract) {
    const data = this.getData();
    data.contracts.unshift(contract);
    this.saveData(data);
  }

  public saveMessage(convId: string, participants: string[], message: Message) {
    const data = this.getData();
    let conv = data.conversations.find((c: Conversation) => c.id === convId);
    if (!conv) {
      conv = { id: convId, participants, messages: [] };
      data.conversations.push(conv);
    }
    conv.messages.push(message);
    this.saveData(data);
  }

  public validateInvite(code: string): boolean {
    return this.getData().invites.includes(code);
  }

  public getInvites(): string[] {
    return this.getData().invites;
  }

  public addInvite(code: string) {
    const data = this.getData();
    if (!data.invites.includes(code)) {
      data.invites.push(code);
      this.saveData(data);
    }
  }

  public removeInvite(code: string) {
    const data = this.getData();
    data.invites = data.invites.filter((i: string) => i !== code);
    this.saveData(data);
  }
}

export const db = MadeDB.getInstance();
