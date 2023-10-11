
const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
//@desc Get all contacts
//@route GET /api/contacts
//@access private
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user_id: req.user.id });
  res.status(200).json(contacts);
});

//@desc Create New contact
//@route POST /api/contacts
//@access private
const createContact = asyncHandler(async (req, res) => {
  console.log("The request body is :", req.body);
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are mandatory !");
  }
  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id: req.user.id,
  });

  res.status(201).json(contact);
});

//@desc Get contact
//@route GET /api/contacts/:id
//@access private
const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.status(200).json(contact);
});

//@desc Update contact
//@route PUT /api/contacts/:id
//@access private
const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  if(contact.user_id.toString() !== req.user.id){
    res.status(403);
    throw new Error("user dont have permission to update other contacts")
  }

  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to update other user contacts");
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedContact);
});

//@desc Delete contact
//@route DELETE /api/contacts/:id
//@access private
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to update other user contacts");
  }
  await Contact.deleteOne({ _id: req.params.id });
  res.status(200).json(contact);
});
// const deleteContact = asyncHandler(async (req, res) => {
//   try {
//     // Find the contact by its ID
//     const contact = await Contact.findById(req.params.id);

//     // Check if the contact exists
//     if (!contact) {
//       res.status(404).json({ error: "Contact not found" });
//       return;
//     }
//     if (contact.user_id.toString() !== req.user.id) {
//       res.status(403);
//       throw new Error(
//         "User don't have permission to update other user contacts"
//       );
//     }

//     // Attempt to remove the contact using the deleteOne method
//     const deletedContact = await Contact.deleteOne({ _id: req.params.id });

//     if (deletedContact.deletedCount === 1) {
//       // Contact successfully deleted
//       res.status(200).json({ message: "Contact deleted successfully" });
//     } else {
//       // Contact was not deleted (possibly due to a non-existent ID)
//       res.status(404).json({ error: "Contact not found" });
//     }
//   } catch (error) {
//     console.error("Error while deleting contact:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });


module.exports = {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};