export class LocalStorageDatabase {
    public createProject(name: string, description: string): void {
        const id = crypto.randomUUID();

        const project : Project = {
            id,
            name,
            description,
        };

        localStorage.setItem(id, JSON.stringify(project));
    }

    public getAll(): Project[] {
        const projects = [];
        for(let i = 0; i < localStorage.length; i++) {
            const projectId = localStorage.key(i)!;
            const projectString = localStorage.getItem(projectId)!;
            const project = JSON.parse(projectString);

            projects.push(project);
        }
        return projects;
    }

    public getById(id: string): Project | null {
        const str = localStorage.getItem(id);
        return (str === null) ? null : JSON.parse(str);
    }

    public deleteById(id: string): boolean {
        const isThereItem = localStorage.getItem(id) ? true : false;
        localStorage.removeItem(id);
        return isThereItem;
    }

    public updateById(id: string, name: string, description: string) : boolean {
        const project = this.getById(id);
        if (project == null) return false;

        const newProject : Project = {
            id,
            name,
            description,
        };
        localStorage.setItem(id, JSON.stringify(newProject));
        return true;
    }
}

export type Project = {
    id: string;
    name: string;
    description: string;
}

const database = new LocalStorageDatabase();
export {
    database,
};