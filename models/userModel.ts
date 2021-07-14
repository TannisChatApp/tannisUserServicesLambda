export class User {
    constructor (
        private slno: string,
        private uid: string,
        private firstName: string,
        private lastName: string,
        private email: string,
        private phoneNumber: string,
        private passwordHash: string,
        private creationDate: string
    ) { }
    public getSlNo (): string { return (this.slno); }
    public getUid (): string { return (this.uid); }
    public getFirstName (): string { return (this.firstName); }
    public getLastName (): string { return (this.lastName); }
    public getEmail (): string { return (this.email); }
    public getPhoneNumber (): string { return (this.phoneNumber); }
    public getPasswordHash (): string { return (this.passwordHash); }
    public getCreationDate (): string { return (this.creationDate); }
    public getDBJsonItem (): object {
        return ({
            "slno": this.slno,
            "uid": this.uid,
            "firstName": this.firstName,
            "lastName": this.lastName,
            "email": this.email,
            "phoneNumber": this.phoneNumber,
            "creationDate" : this.creationDate
        });
    }
    public setSlNo (slno: string): void { this.slno = slno; }
    public setUid (uid: string): void { this.uid = uid; }
    public setFirstName (firstName: string): void { this.firstName = firstName; }
    public setLastName (lastName: string): void { this.lastName = lastName; }
    public setEmail (email: string): void { this.email = email; }
    public setPhoneNumber (phoneNumber: string): void { this.phoneNumber = phoneNumber; }
    public setPasswordHash (passwordHash: string): void { this.passwordHash = passwordHash; }
    public setCreationDate (creationDate: string): void { this.creationDate = creationDate; }
}
