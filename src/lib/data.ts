export class LocalStorageDatabase {
  constructor() {
    if (!localStorage.getItem("project")) localStorage.setItem("project", "[]");
    if (!localStorage.getItem("activeProject"))
      localStorage.setItem("activeProject", "null");
    if (!localStorage.getItem("feature")) localStorage.setItem("feature", "[]");
    if (!localStorage.getItem("user")) localStorage.setItem("user", "[]");
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
      ownerId: "sillyHippoAdmin",
    };

    const features = this.getAll<Feature>("feature");
    features.push(feature);
    localStorage.setItem("feature", JSON.stringify(features));
  }

  public getAll<T extends DatabaseEntry>(type: DataType): T[] {
    const projectArrayStr = localStorage.getItem(type)!;
    return JSON.parse(projectArrayStr);
  }

  public getAllFeaturesByProject(projectId?: string): Feature[] {
    const features = this.getAll<Feature>("feature");
    return features.filter((feature) => feature.projectId == projectId);
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
      if (projects[i].id == id) {
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
      if (features[i].id == id) {
        features[i] = {
          id,
          name,
          description,
          priority,
          projectId: features[i].projectId,
          startDate: features[i].startDate,
          state,
          ownerId: "sillyHippoAdmin",
        };
        localStorage.setItem("feature", JSON.stringify(features));
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

    throw new Error("unreachable");
  }

  public setActiveProject(project: Project): void {
    localStorage.setItem("activeProjectId", project.id);
  }
}

export type DataType = "project" | "user" | "feature";

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

export type Priority = "low" | "medium" | "high";
export type FeatureState = "todo" | "doing" | "done";

type DatabaseEntries = {
  project: Project;
  user: User;
  feature: Feature;
};

type DatabaseKey = keyof DatabaseEntries;
type DatabaseEntry = DatabaseEntries[DatabaseKey];

export type UserRole = "admin" | "devops" | "developer";

export const database = new LocalStorageDatabase();

export type User = {
  id: string;
  name: string;
  surname: string;
  role: UserRole;
};

const admin: User = {
  id: "sillyHippoAdmin",
  name: "Hipa",
  surname: "Dripa",
  role: "admin",
};

export type UserState = {
  users: User[];
  activeUser: User;
};

export type UserActionType = "activeUserChanged" | "userAdded";

export type UserAction = {
  type: UserActionType;
  user: User;
};

export function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case "activeUserChanged":
      return {
        ...state,
        activeUser: action.user,
      };
    case "userAdded":
      return {
        ...state,
        users: [...state.users, action.user],
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
  // TODO: 💾🎀🦛
  return {
    users: [admin],
    activeUser: admin,
  };
}

export type ProjectActionType = "activeProjectChanged";

export type ProjectAction = {
  type: ProjectActionType;
  project: Project;
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
  }
}

export type FeaturesState = {
  features: Feature[];
};
export type FeatureAction =
  | {
      type: "deleteFeature";
      feature: Feature;
    }
  | {
      type: "updateFeature";
      id: string;
      name: string;
      description: string;
      priority: Priority;
      state: FeatureState;
    };

export function getInitialFeaturesState(): FeaturesState {
  return { features: database.getAll("feature") };
}

export function featureReducer(
  state: FeaturesState,
  action: FeatureAction
): FeaturesState {
  switch (action.type) {
    case "deleteFeature":
      database.deleteById("feature", action.feature.id);
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
  }
}
