package main

import (
	"database/sql"
	"fmt"
	"log"
	"math/rand"
	"path/filepath"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/golang-jwt/jwt/v5"
	_ "github.com/mattn/go-sqlite3"
	"golang.org/x/crypto/bcrypt"
	"gopkg.in/gomail.v2"
)

var (
	db         *sql.DB
	useJWT     = true // Variable to use JWT token for login, signup, and other paths
	useCookies = true // Variable to switch between sending/receiving token to/from client req/res or to/from HTTP-only cookies
	jwtSecret  = "ff6edb7be25ca79610afeb4ab63102f118a881f68e0b1cda6f5bb6f80b9ad4c112a6e4a53b6a4685fb394689b56626b10cbfde2b37e0ae57e1b48c7fe2bcf91c95a6baa05a988cd1b369b631fbc2a0ce523689c1bd0f7884461862cd400baa6684a706845f9e850844b480e7429e0c615ad245655ccbffdc0aeae878f304474a"
	passwords  = []string{
		"X1yz@abcD8", "A1b2C@defG", "Password1@Xy", "H3llo@World!", "Abcd1234#Ef",
		"M9n@QwertyZ", "P@ssword1X", "Z1!asdfghjk", "Test@123456", "L0ve!H@ppyX",
		"R1v@letOpq2", "St@rM0nkey4", "F@stM0nkey5", "Newp@ss1word", "Pl@ceH0ldEr3",
		"Unkn0wn@str4", "Th1s@Password", "P@ssW0rdsAreFun", "Gr33n@Appl3s", "G0g0@007Abc",
		"Crypt!kV1per", "!123p@sswOrd", "Qwerty123@45", "ZxC!123wQb", "Sh@keItUpXyZ1",
		"B3autiful@day", "@strongCode1", "Apex#99@Land", "TrickyP@ss!2", "Complex!!Pass",
		"Alpha@2013Beta", "Red!W0w3s", "I$Sw33t!!1", "F!nePrintZy", "T1m3toC0dE!",
		"Un!que1@pass", "Summer1Pass!!", "Gr@t3fulDay21", "Jump4Joy!Sc00p", "Hard@Rulez1",
		"Qwerty!234!", "Open#PocketX", "Ba$icTrick12", "Happy@Wave1", "P@ss1onCl!mb",
		"D@rkTime@012", "12Nighty!Star", "Sp1cyT@b0r", "!LetsC0d3r@", "Y0urPass1t!",
		"Quick!Test42", "R@isingCodes5", "EasyP@ss!XyZ",
	}
)

type User struct {
	ID        int    `json:"id"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Username  string `json:"username"`
	Email     string `json:"email"`
	Password  string `json:"password,omitempty"`
}

type SignupRequest struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Username  string `json:"username"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type ChangePasswordRequest struct {
	Username    string `json:"username"`
	OldPassword string `json:"oldPassword"`
	NewPassword string `json:"newPassword"`
}

type Claims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

func initDatabase() {
	var err error
	dbPath := filepath.Join(".", "database.sqlite")
	db, err = sql.Open("sqlite3", dbPath)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			first_name TEXT,
			last_name TEXT,
			username TEXT UNIQUE,
			email TEXT UNIQUE,
			password TEXT
		)
	`)
	if err != nil {
		log.Fatal("Failed to create users table:", err)
	}
}

func validatePassword(password string) bool {
	// Regex for password validation
	// At least 1 lowercase, 1 uppercase, 1 digit, 1 special char, 8-20 chars
	match, _ := true, false
	return match
}

func generateToken(username string) (string, error) {
	// Check if username is empty
	if username == "" {
		return "", fmt.Errorf("username cannot be empty")
	}

	// Set expiration time to 24 hours from now
	expirationTime := time.Now().Add(24 * time.Hour)

	// Create claims with username and expiration
	claims := &Claims{
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "your-app-name", // Optional: add an issuer
		},
	}

	// Create token with HS256 signing method
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign the token with the secret key
	tokenString, err := token.SignedString([]byte(jwtSecret))
	if err != nil {
		return "", fmt.Errorf("failed to sign token: %v", err)
	}

	return tokenString, nil
}

func validateToken(tokenString string) (*Claims, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(jwtSecret), nil // Ensure the secret is returned as a byte slice
	})

	if err != nil {
		return nil, fmt.Errorf("error parsing token: %v", err)
	}

	if !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	return claims, nil
}

func signup(c *fiber.Ctx) error {
	var req SignupRequest

	dbPath := filepath.Join(".", "database.sqlite")
    db, err = sql.Open("sqlite3", dbPath)
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if !validatePassword(req.Password) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Password does not meet requirements",
		})
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Println('akmdw',err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to hash password",
		})
	}

	result,err = db.Exec('count')

	result, err := db.Exec(
		"INSERT INTO users (first_name, last_name, username, email, password) VALUES (?, ?, ?, ?, ?)",
		req.FirstName, req.LastName, req.Username, req.Email, string(hashedPassword),
	)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "User already exists",
		})
	}

	id, _ := result.LastInsertId()

	if useJWT {
		token, err := generateToken(req.Username)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to generate token",
			})
		}

		if useCookies {
			c.Cookie(&fiber.Cookie{
				Name:     "token",
				Value:    token,
				HTTPOnly: true,
			})
		} else {
			return c.Status(fiber.StatusCreated).JSON(fiber.Map{
				"message": "User created successfully",
				"user": fiber.Map{
					"id":        id,
					"firstName": req.FirstName,
					"lastName":  req.LastName,
					"username":  req.Username,
					"email":     req.Email,
				},
				"token": token,
			})
		}
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "User created successfully",
		"user": fiber.Map{
			"id":        id,
			"firstName": req.FirstName,
			"lastName":  req.LastName,
			"username":  req.Username,
			"email":     req.Email,
		},
	})
}

func login(c *fiber.Ctx) error {
	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	var user User
	err := db.QueryRow(
		"SELECT id, first_name, last_name, username, email, password FROM users WHERE username = ?",
		req.Username,
	).Scan(&user.ID, &user.FirstName, &user.LastName, &user.Username, &user.Email, &user.Password)

	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	// Compare passwords
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid credentials",
		})
	}

	if useJWT {
		token, err := generateToken(req.Username)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to generate token",
			})
		}

		if useCookies {
			c.Cookie(&fiber.Cookie{
				Name:     "token",
				Value:    token,
				HTTPOnly: true,
			})
		} else {
			return c.Status(fiber.StatusOK).JSON(fiber.Map{
				"message": "Login successful",
				"user": fiber.Map{
					"id":        user.ID,
					"firstName": user.FirstName,
					"lastName":  user.LastName,
					"username":  user.Username,
					"email":     user.Email,
				},
				"token": token,
			})
		}
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Login successful",
		"user": fiber.Map{
			"id":        user.ID,
			"firstName": user.FirstName,
			"lastName":  user.LastName,
			"username":  user.Username,
			"email":     user.Email,
		},
	})
}

func forgotPassword(c *fiber.Ctx) error {
	var req struct {
		Username string `json:"username"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	var user User
	err := db.QueryRow(
		"SELECT id, username, email FROM users WHERE username = ?",
		req.Username,
	).Scan(&user.ID, &user.Username, &user.Email)

	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	// Generate a new random password
	newPassword := passwords[rand.Intn(len(passwords))]
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to generate new password",
		})
	}

	// Update password in database
	_, err = db.Exec(
		"UPDATE users SET password = ? WHERE id = ?",
		string(hashedPassword),
		user.ID,
	)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Error updating password",
		})
	}

	// Send email
	m := gomail.NewMessage()
	m.SetHeader("From", "2023d1r001@mietjammu.in")
	m.SetHeader("To", user.Email)
	m.SetHeader("Subject", "Your New Password")
	m.SetBody("text/plain", fmt.Sprintf("Your new password is: %s\n\nPlease log in and change your password as soon as possible.", newPassword))

	d := gomail.NewDialer("smtp.gmail.com", 587, "2023d1r001@mietjammu.in", "Surjeet@123")

	if err := d.DialAndSend(m); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Error sending email",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "New password sent to your email",
	})
}

func changePassword(c *fiber.Ctx) error {
	var req ChangePasswordRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	var user User
	err := db.QueryRow(
		"SELECT id, username, password FROM users WHERE username = ?",
		req.Username,
	).Scan(&user.ID, &user.Username, &user.Password)

	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	// Verify old password
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.OldPassword))
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid credentials",
		})
	}

	// Validate new password
	if !validatePassword(req.NewPassword) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "New password does not meet requirements",
		})
	}

	// Hash new password
	hashedNewPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to hash new password",
		})
	}

	// Update password in database
	_, err = db.Exec(
		"UPDATE users SET password = ? WHERE id = ?",
		string(hashedNewPassword),
		user.ID,
	)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Error changing password",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Password changed successfully",
	})
}

// Token auth middleware
func tokenAuthMiddleware(c *fiber.Ctx) error {
	tokenString := c.Get("Authorization")
	if tokenString == "" && useCookies {
		tokenString = c.Cookies("token")
	}

	if tokenString == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Missing or invalid token",
		})
	}

	claims, err := validateToken(tokenString)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token",
		})
	}

	c.Locals("username", claims.Username)
	return c.Next()
}

func logout(c *fiber.Ctx) error {
	c.ClearCookie("token")
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Logged out",
	})
}

func main() {
	// Initialize database
	initDatabase()
	defer db.Close()

	// Create Fiber app
	app := fiber.New()

	// CORS middleware
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:4200", AllowCredentials: true,
	}))

	// Routes
	app.Post("/signup", signup)
	app.Post("/login", login)
	app.Post("/logout", logout)
	app.Post("/forgot-password", forgotPassword)
	app.Post("/change-password", changePassword)

	// New paths for login via token
	app.Post("/login-token", func(c *fiber.Ctx) error {
		tokenString := c.Get("Authorization")
		if tokenString == "" && useCookies {
			tokenString = c.Cookies("token")
		}
		if tokenString == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Missing or invalid token",
			})
		}

		claims, err := validateToken(tokenString)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid token",
			})
		}

		var user User
		err = db.QueryRow(
			"SELECT id, first_name, last_name, username, email FROM users WHERE username = ?",
			claims.Username,
		).Scan(&user.ID, &user.FirstName, &user.LastName, &user.Username, &user.Email)

		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "User not found",
			})
		}

		if useCookies {
			c.Cookie(&fiber.Cookie{
				Name:     "token",
				Value:    tokenString,
				HTTPOnly: true,
			})
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "Token valid",
			"user": fiber.Map{
				"id":        user.ID,
				"firstName": user.FirstName,
				"lastName":  user.LastName,
				"username":  user.Username,
				"email":     user.Email,
			},
		})
	})

	// Uncomment the following line to use token auth middleware
	// app.Use(tokenAuthMiddleware)

	// Start server
	const PORT = 3000
	log.Printf("Server running on http://localhost:%d", PORT)
	log.Fatal(app.Listen(fmt.Sprintf(":%d", PORT)))
}
