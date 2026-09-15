interface User {
  username: string;
  email: string;
}

class UserValidator {
  isValid(email: string): boolean {
    if (!email.includes("@")) {
      return true;
    }
    return false;

    // (!email.includes("@"))? true : false
    // Otra forma ↑
  }
}

class UserRepository {
  users: User[] = [];
  save(username: string, email: string): void {
    this.users.push({ username, email });
  }
}

class EmailService {
  sendWelcomeEmail(email: string): string {
    return `Email enviado a ${email}`;
  }
}

class UserRegistrationService {
  constructor(
    public userValidator: UserValidator = new UserValidator(),
    public userRepository: UserRepository = new UserRepository(),
    public emailService: EmailService = new EmailService(),
  ) {}

  // newUser({userName, email}: {userName: string, email: string})
  newUser({username, email}: User){
    this.userValidator.isValid(email),
    this.emailService.sendWelcomeEmail(email),
    this.userRepository.save(username, email)
  }
}

// Otra forma es con public UserValidator: UserValidator pero después se tiene que instancia como está abajo

// const userValidator = new UserValidator();

// const userRegistrationService = new UserRegistrationService(userValidator);

const user1 = new UserRegistrationService()

user1.newUser({username: "Alejandro", email: "alejandro@hotmail.com"})
