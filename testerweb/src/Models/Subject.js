class Subject{
    constructor(id, title){
        this.id = id;
        this.title = title;
    }

    static async getSubjects() {
        try {
            const response = await fetch('../data/subjects.json'); // Path to your JSON file
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching subjects:', error);
            return [];
        }
    }


}