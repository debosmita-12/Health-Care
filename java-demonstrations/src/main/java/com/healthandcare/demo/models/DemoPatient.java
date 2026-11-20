package com.healthandcare.demo.models;

public class DemoPatient {
    private int id;
    private String name;
    private String email;
    private String phone;
    private String gender;
    private String registrationDate;

    public DemoPatient() {}

    public DemoPatient(int id, String name, String email, String phone, String gender, String registrationDate) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.gender = gender;
        this.registrationDate = registrationDate;
    }

    public DemoPatient(String name, String email, String phone, String gender, String registrationDate) {
        this(-1, name, email, phone, gender, registrationDate);
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(String registrationDate) { this.registrationDate = registrationDate; }

    @Override
    public String toString() {
        return "DemoPatient[id=" + id + ", name=" + name + ", email=" + email + ", phone=" + phone + ", gender=" + gender + "]";
    }
}
