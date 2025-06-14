const API_PATH = "http://localhost:3000";

export class LocalStorageDatabase {
  constructor() {
    if (!localStorage.getItem("project")) localStorage.setItem("project", "[]");
    if (!localStorage.getItem("activeProject"))
      localStorage.setItem("activeProject", "null");
    if (!localStorage.getItem("feature")) localStorage.setItem("feature", "[]");
    if (!localStorage.getItem("user"))
      localStorage.setItem("user", JSON.stringify([admin, developer, devops]));
    if (!localStorage.getItem("task")) localStorage.setItem("task", "[]");
  }

  public createProject(name: string, description: string): void {
    const id = crypto.randomUUID();

    const project: Project = {
      id,
      name,
      description,
    };

    const projects = this.getAll<Project>("project");
    projects.push(project);
    localStorage.setItem("project", JSON.stringify(projects));
  }

  public createFeature(
    name: string,
    description: string,
    priority: Priority,
    projectId: string,
    startDate: string,
    state: FeatureState
  ) {
    const id = crypto.randomUUID();

    const feature: Feature = {
      id,
      name,
      description,
      priority,
      projectId,
      startDate,
      state,
      ownerId: admin.id,
    };

    const features = this.getAll<Feature>("feature");
    features.push(feature);
    localStorage.setItem("feature", JSON.stringify(features));
  }

  public createTask(
    name: string,
    description: string,
    priority: Priority,
    featureId: string,
    estimatedTime: string,
    state: FeatureState,
    addDate: string,
    ownerId: string | undefined
  ) {
    const id = crypto.randomUUID();

    const task: Task = {
      id,
      name,
      description,
      priority,
      featureId,
      estimatedTime,
      state,
      addDate,
      ownerId,
    };

    const tasks = this.getAll<Task>("task");
    tasks.push(task);
    localStorage.setItem("task", JSON.stringify(tasks));
  }

  public getAll<T extends DatabaseEntry>(type: DataType): T[] {
    const projectArrayStr = localStorage.getItem(type)!;
    return JSON.parse(projectArrayStr);
  }

  public getAllFeaturesByProject(projectId?: string): Feature[] {
    const features = this.getAll<Feature>("feature");
    return features.filter((feature) => feature.projectId == projectId);
  }

  public getAllTasksByFeature(featureId?: string): Task[] {
    const tasks = this.getAll<Task>("task");
    return tasks.filter((task) => task.featureId == featureId);
  }

  public getById<T extends DatabaseEntry>(
    type: DataType,
    id: string
  ): T | null {
    const arrStr = localStorage.getItem(type)!;
    const arr = JSON.parse(arrStr) as T[];

    for (const item of arr) {
      if (item.id == id) {
        return item;
      }
    }

    return null;
  }

  public deleteById<T extends DatabaseEntry>(
    type: DataType,
    id: string
  ): boolean {
    const items = this.getAll<T>(type);
    for (let i = 0; i < items.length; i++) {
      if (items[i].id == id) {
        items.splice(i, 1);
        localStorage.setItem(type, JSON.stringify(items));
        return true;
      }
    }
    return false;
  }

  public updateProjectById(
    id: string,
    name: string,
    description: string
  ): boolean {
    const projects = this.getAll<Project>("project");
    for (let i = 0; i < projects.length; i++) {
      if (projects[i].id === id) {
        projects[i] = {
          id,
          name,
          description,
        };
        localStorage.setItem("project", JSON.stringify(projects));
        return true;
      }
    }
    return false;
  }

  public updateFeatureById(
    id: string,
    name: string,
    description: string,
    priority: Priority,
    state: FeatureState
  ): boolean {
    const features = this.getAll<Feature>("feature");
    for (let i = 0; i < features.length; i++) {
      if (features[i].id === id) {
        features[i] = {
          id,
          name,
          description,
          priority,
          projectId: features[i].projectId,
          startDate: features[i].startDate,
          state,
          ownerId: admin.id,
        };
        localStorage.setItem("feature", JSON.stringify(features));
        return true;
      }
    }
    return false;
  }

  public updateTaskById(
    id: string,
    name: string,
    description: string,
    priority: Priority,
    estimatedTime: string,
    state: FeatureState,
    startDate: string,
    endDate: string,
    ownerId: string | undefined
  ): boolean {
    const tasks = this.getAll<Task>("task");
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id === id) {
        tasks[i] = {
          id,
          name,
          description,
          priority,
          estimatedTime,
          state,
          featureId: tasks[i].featureId,
          addDate: tasks[i].addDate,
          startDate,
          endDate,
          ownerId,
        };
        localStorage.setItem("task", JSON.stringify(tasks));
        return true;
      }
    }
    return false;
  }

  public getActiveProject(): Project | null {
    const projectId = localStorage.getItem("activeProjectId");
    if (projectId === null) return null;

    const projects = this.getAll<Project>("project");

    for (const proj of projects) {
      if (proj.id === projectId) return proj;
    }
    
    return null;
  }

  public setActiveProject(project: Project): void {
    localStorage.setItem("activeProjectId", project.id);
  }

  public getActiveFeature(): Feature | null {
    const featureId = localStorage.getItem("activeFeatureId");
    if (featureId == null) return null;

    const features = this.getAll<Feature>("feature");

    for (const feature of features) {
      if (feature.id === featureId) return feature;
    }
    
    return null;
  }

  public setActiveFeature(feature: Feature): void {
    localStorage.setItem("activeFeatureId", feature.id);
  }

  public setActiveUser(user: User): void {
    localStorage.setItem("activeUserId", user.id);
  }

  public setUserToken(token: string, refreshToken: string): void {
    localStorage.setItem(
      "userToken",
      `{"token": "${token}", "refreshToken": "${refreshToken}"}`
    );
  }

  public getActiveUser(): User | undefined {
    const activeUserId = localStorage.getItem("activeUserId");
    if (!activeUserId) return undefined;

    const users = this.getAll<User>("user");

    for (const user of users) {
      if (user.id === activeUserId) return user;
    }

    localStorage.removeItem("activeUserId");
    return undefined;
  }

  public async refreshUserTokenIfNeeded(): Promise<boolean> {
    const userTokenString = localStorage.getItem("userToken");
    if (!userTokenString) throw new Error("User has no token!");

    const userToken = JSON.parse(userTokenString);

    const resp = await fetch(`${API_PATH}/refreshToken`, {
      method: "POST",
      body: `{"refreshToken": "${userToken.refreshToken}"}`,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!resp.ok) {
      this.logoutCurrentUser();
      return false;
    }

    const { token, refreshToken } = await resp.json();
    this.setUserToken(token, refreshToken);
    return true;
  }

  public async loginUser(
    loginParams: LoginParams
  ): Promise<UserCredentials | undefined> {
    const userTokenString = localStorage.getItem("userToken");
    if (userTokenString) {
      const userToken = JSON.parse(userTokenString);

      const resp = await fetch(`${API_PATH}/refreshToken`, {
        method: "POST",
        body: `{"refreshToken": "${userToken.refreshToken}"}`,
      });

      if (resp.ok) {
        const activeUser = this.getActiveUser();
        if (!activeUser) throw new Error("Wny no active user");

        const userToken = (await resp.json()) as {
          token: string;
          refreshToken: string;
        };
        return {
          user: activeUser,
          ...userToken,
        };
      }
    }

    const response = await fetch(`${API_PATH}/login`, {
      method: "POST",
      body: JSON.stringify(loginParams),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) return;

    const credentials = (await response.json()) as UserCredentials;
    return credentials;
  }

  public async registerUser(
    params: LoginParams
  ): Promise<UserCredentials | undefined> {
    const response = await fetch(`${API_PATH}/register`, {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) return;

    const credentials = (await response.json()) as UserCredentials;
    const users = this.getAll<User>("user");
    users.push(credentials.user);
    localStorage.setItem("user", JSON.stringify(users));
    return credentials;
  }

  public logoutCurrentUser(): void {
    localStorage.removeItem("userToken");
    localStorage.removeItem("activeUserId");
  }
}

export type LoginParams = {
  name: string;
  surname: string;
  password: string;
  googleId?: string;
  email?: string;
};

export type DataType = "project" | "user" | "feature" | "task";

export type Project = {
  id: string;
  name: string;
  description: string;
};

export type Feature = {
  id: string;
  name: string;
  description: string;
  priority: Priority;
  projectId: string;
  startDate: string; // iso string
  state: FeatureState;
  ownerId: string;
};

export type Task = {
  id: string;
  name: string;
  description: string;
  priority: Priority;
  featureId: string;
  estimatedTime: string;
  state: FeatureState;
  addDate: string;
  startDate?: string;
  endDate?: string;
  ownerId?: string;
};

export type Priority = "low" | "medium" | "high";
export type FeatureState = "todo" | "doing" | "done";

type DatabaseEntries = {
  project: Project;
  user: User;
  feature: Feature;
  task: Task;
};

type DatabaseKey = keyof DatabaseEntries;
type DatabaseEntry = DatabaseEntries[DatabaseKey];

export type UserRole = "admin" | "devops" | "developer" | "guest";

const admin: User = {
  id: "admin",
  name: "admin",
  surname: "admin",
  role: "admin",
};

const developer: User = {
  id: "developer",
  name: "developer",
  surname: "developer",
  role: "developer",
};

const devops: User = {
  id: "devops",
  name: "devops",
  surname: "devops",
  role: "devops",
};

export const database = new LocalStorageDatabase();

export type User = {
  id: string;
  name: string;
  surname: string;
  role: UserRole;
  email?: string;
  googleId?: string;
};

export type UserCredentials = {
  user: User;
  refreshToken: string;
  token: string;
};

export type UserState = {
  users: User[];
  activeUser?: User;
};

export type UserActionType =
  | "activeUserChanged"
  | "userAdded"
  | "userLoggedOut";

export type UserAction =
  | {
      type: UserActionType;
      user: User;
    }
  | {
      type: "userLoggedIn";
      credentials: UserCredentials;
    };

export function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case "activeUserChanged":
      database.setActiveUser(action.user);
      return {
        ...state,
        activeUser: action.user,
      };
    case "userAdded":
      return {
        ...state,
        users: [...state.users, action.user],
      };
    case "userLoggedOut":
      database.logoutCurrentUser();
      return {
        ...state,
        activeUser: undefined,
      };
    case "userLoggedIn":
      database.setActiveUser(action.credentials.user);
      database.setUserToken(
        action.credentials.token,
        action.credentials.refreshToken
      );
      return {
        ...state,
        activeUser: action.credentials.user,
      };
  }
}

export type ProjectState = {
  projects: Project[];
  activeProject: Project | null;
};

export function getInitialProjectState(): ProjectState {
  return {
    projects: database.getAll("project"),
    activeProject: database.getActiveProject(),
  };
}

export function getInitialUserState(): UserState {
  return {
    users: database.getAll("user"),
    activeUser: database.getActiveUser(),
  };
}

export type ProjectAction =
  | {
      type: "activeProjectChanged";
      project: Project;
    }
  | {
      type: "createProject";
      name: string;
      description: string;
    }
  | {
      type: "deleteProject";
      id: string;
    }
  | {
      type: "updateProject";
      id: string;
      name: string;
      description: string;
    };

export function projectReducer(
  state: ProjectState,
  action: ProjectAction
): ProjectState {
  switch (action.type) {
    case "activeProjectChanged":
      database.setActiveProject(action.project);
      return {
        ...state,
        activeProject: action.project,
      };
    case "createProject":
      database.createProject(action.name, action.description);
      return {
        ...state,
        projects: database.getAll("project"),
      };
    case "deleteProject":
      database.deleteById("project", action.id);
      return {
        ...state,
        projects: database.getAll("project"),
      };
    case "updateProject":
      database.updateProjectById(action.id, action.name, action.description);
      return {
        ...state,
        projects: database.getAll("project"),
      };
  }
}

export type FeaturesState = {
  features: Feature[];
  activeFeature: Feature | null;
};

export type FeatureAction =
  | {
      type: "deleteFeature";
      id: string;
    }
  | {
      type: "updateFeature";
      id: string;
      name: string;
      description: string;
      priority: Priority;
      state: FeatureState;
    }
  | {
      type: "createFeature";
      name: string;
      description: string;
      priority: Priority;
      projectId: string;
      startDate: string;
      state: FeatureState;
    }
  | {
      type: "activeFeatureChanged";
      feature: Feature;
    };

export function getInitialFeaturesState(): FeaturesState {
  return {
    features: database.getAll("feature"),
    activeFeature: database.getActiveFeature(),
  };
}

export function featureReducer(
  state: FeaturesState,
  action: FeatureAction
): FeaturesState {
  switch (action.type) {
    case "activeFeatureChanged":
      database.setActiveFeature(action.feature);
      return {
        ...state,
        activeFeature: action.feature,
      };
    case "deleteFeature":
      database.deleteById("feature", action.id);
      return {
        ...state,
        features: database.getAll("feature"),
      };
    case "updateFeature":
      database.updateFeatureById(
        action.id,
        action.name,
        action.description,
        action.priority,
        action.state
      );
      return {
        ...state,
        features: database.getAll("feature"),
      };
    case "createFeature":
      database.createFeature(
        action.name,
        action.description,
        action.priority,
        action.projectId,
        action.startDate,
        action.state
      );
      return {
        ...state,
        features: database.getAll("feature"),
      };
  }
}

export type TaskState = {
  tasks: Task[];
};

export type TaskAction =
  | {
      type: "deleteTask";
      id: string;
    }
  | {
      type: "createTask";
      name: string;
      description: string;
      priority: Priority;
      featureId: string;
      estimatedTime: string;
      state: FeatureState;
      addDate: string;
      ownerId: string | undefined;
    }
  | {
      type: "updateTask";
      id: string;
      name: string;
      description: string;
      priority: Priority;
      featureId: string;
      estimatedTime: string;
      state: FeatureState;
      startDate: string;
      endDate: string;
      ownerId: string | undefined;
    };

export function getInitialTaskState(): TaskState {
  return { tasks: database.getAll("task") };
}

export function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case "createTask":
      database.createTask(
        action.name,
        action.description,
        action.priority,
        action.featureId,
        action.estimatedTime,
        action.state,
        action.addDate,
        action.ownerId
      );
      return {
        ...state,
        tasks: database.getAll("task"),
      };
    case "deleteTask":
      database.deleteById("task", action.id);
      return {
        ...state,
        tasks: database.getAll("task"),
      };
    case "updateTask":
      database.updateTaskById(
        action.id,
        action.name,
        action.description,
        action.priority,
        action.estimatedTime,
        action.state,
        action.startDate,
        action.endDate,
        action.ownerId
      );
      return {
        ...state,
        tasks: database.getAll("task"),
      };
  }
}
