interface TrainerData{
    id: string;
    name: string;
    speciality: string[];
    photo: string;
    experience: string;
    price: number;
};

export class ClientTrainerDTO{
    static mapToTrainerData(raw):TrainerData{
        console.log(raw);
        const data = raw.data;
        const user = raw.user;
        return {
            id: user._id.toString(),
            name: user.name,
            speciality: data.professionalSummary.specializations,
            photo: raw.profilePicture[0].filePath,
            experience: data.professionalSummary.yearsOfExperience.toString(),
            price: data.basicInfo.weeklySalary
        };
    }
}