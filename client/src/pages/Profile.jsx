// import { useState, useEffect } from 'react'
// import { useUser } from '@clerk/clerk-react'



// const Profile = () => {
//   const { user } = useUser()
//   const [isEditing, setIsEditing] = useState(false)
//   const [isUploading, setIsUploading] = useState(false)
//   const [userData, setUserData] = useState(null)
//   const [stats, setStats] = useState({
//     notesViewed: 0,
//     downloads: 0,
//     subjects: 0,
//     activeDays: 0
//   })
//   const [formData, setFormData] = useState({
//     bio: '',
//     website: '',
//     twitter: '',
//     github: '',
//     phone: '',
//     course: '',
//     semester: '',
//     university: '',
//     enrollmentNo: ''
//   })

//   // Fetch user data and statistics
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         // Fetch user profile data
//         const userProfile = await userService.getUserProfile(user.id)
//         setUserData(userProfile)
        
//         // Set form data with existing values or defaults
//         setFormData({
//           bio: userProfile.bio || 'Computer Science student passionate about learning and sharing knowledge.',
//           website: userProfile.website || '',
//           twitter: userProfile.twitter || '',
//           github: userProfile.github || '',
//           phone: userProfile.phone || '',
//           course: userProfile.course || '',
//           semester: userProfile.semester || '',
//           university: userProfile.university || '',
//           enrollmentNo: userProfile.enrollmentNo || ''
//         })

//         // Fetch user statistics
//         const userStats = await userService.getUserStats(user.id)
//         setStats(userStats)
//       } catch (error) {
//         console.error('Error fetching user data:', error)
//       }
//     }

//     if (user) {
//       fetchUserData()
//     }
//   }, [user])

//   const handleInputChange = (e) => {
//     const { name, value } = e.target
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }))
//   }

//   const handleProfilePictureUpload = async (e) => {
//     const file = e.target.files[0]
//     if (!file) return

//     setIsUploading(true)
//     try {
//       // In a real app, you would upload to your backend or Clerk
//       // This is a simplified example
//       await userService.uploadProfilePicture(user.id, file)
      
//       // Update local user data
//       const imageUrl = URL.createObjectURL(file)
//       setUserData(prev => ({ ...prev, profileImage: imageUrl }))
//     } catch (error) {
//       console.error('Error uploading profile picture:', error)
//     } finally {
//       setIsUploading(false)
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     try {
//       // Save profile data to backend
//       await userService.updateUserProfile(user.id, formData)
      
//       // Update local state
//       setUserData(prev => ({ ...prev, ...formData }))
//       setIsEditing(false)
      
//       // Show success message (you could use a toast notification here)
//       alert('Profile updated successfully!')
//     } catch (error) {
//       console.error('Error updating profile:', error)
//       alert('Error updating profile. Please try again.')
//     }
//   }

//   const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

//   if (!userData) {
//     return (
//       <div className="max-w-4xl mx-auto flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="bg-white rounded-xl shadow-md overflow-hidden">
//         {/* Profile Header */}
//         <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-8 text-white">
//           <div className="flex items-center space-x-6">
//             <div className="relative">
//               <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center overflow-hidden">
//                 {userData.profileImage ? (
//                   <img 
//                     src={userData.profileImage} 
//                     alt="Profile" 
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <span className="text-2xl font-bold">
//                     {user?.firstName?.[0]}{user?.lastName?.[0]}
//                   </span>
//                 )}
//               </div>
//               {isEditing && (
//                 <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer shadow-md">
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleProfilePictureUpload}
//                     className="hidden"
//                     disabled={isUploading}
//                   />
//                   {isUploading ? (
//                     <div className="w-6 h-6 animate-spin rounded-full border-b-2 border-primary-600"></div>
//                   ) : (
//                     <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
//                     </svg>
//                   )}
//                 </label>
//               )}
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold">
//                 {user?.firstName} {user?.lastName}
//               </h1>
//               <p className="text-primary-100">{user?.primaryEmailAddress?.emailAddress}</p>
//               <p className="text-primary-100">Joined {new Date(user?.createdAt).toLocaleDateString()}</p>
//             </div>
//           </div>
//         </div>

//         {/* Profile Content */}
//         <div className="p-6">
//           {!isEditing ? (
//             <>
//               <div className="flex justify-between items-start mb-6">
//                 <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
//                 <button
//                   onClick={() => setIsEditing(true)}
//                   className="btn-primary"
//                 >
//                   Edit Profile
//                 </button>
//               </div>

//               <div className="grid md:grid-cols-2 gap-6 mb-8">
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500 mb-2">Bio</h3>
//                   <p className="text-gray-900">{formData.bio}</p>
                  
//                   <h3 className="text-sm font-medium text-gray-500 mt-4 mb-2">Academic Information</h3>
//                   <div className="space-y-2">
//                     {formData.university && (
//                       <p className="text-gray-900"><span className="font-medium">University:</span> {formData.university}</p>
//                     )}
//                     {formData.course && (
//                       <p className="text-gray-900"><span className="font-medium">Course:</span> {formData.course}</p>
//                     )}
//                     {formData.semester && (
//                       <p className="text-gray-900"><span className="font-medium">Semester:</span> {formData.semester}</p>
//                     )}
//                     {formData.enrollmentNo && (
//                       <p className="text-gray-900"><span className="font-medium">Enrollment No:</span> {formData.enrollmentNo}</p>
//                     )}
//                     {formData.phone && (
//                       <p className="text-gray-900"><span className="font-medium">Phone:</span> {formData.phone}</p>
//                     )}
//                   </div>
//                 </div>
                
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500 mb-2">Social Links</h3>
//                   <div className="space-y-2">
//                     {formData.website && (
//                       <div className="flex items-center">
//                         <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
//                         </svg>
//                         <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
//                           {formData.website}
//                         </a>
//                       </div>
//                     )}
//                     {formData.twitter && (
//                       <div className="flex items-center">
//                         <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//                         </svg>
//                         <a href={`https://twitter.com/${formData.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
//                           {formData.twitter}
//                         </a>
//                       </div>
//                     )}
//                     {formData.github && (
//                       <div className="flex items-center">
//                         <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
//                         </svg>
//                         <a href={`https://github.com/${formData.github}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
//                           {formData.github}
//                         </a>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <form onSubmit={handleSubmit}>
//               <div className="flex justify-between items-start mb-6">
//                 <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
//                 <div className="space-x-2">
//                   <button
//                     type="button"
//                     onClick={() => setIsEditing(false)}
//                     className="btn-secondary"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="btn-primary"
//                   >
//                     Save Changes
//                   </button>
//                 </div>
//               </div>

//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Bio
//                   </label>
//                   <textarea
//                     name="bio"
//                     value={formData.bio}
//                     onChange={handleInputChange}
//                     rows={4}
//                     className="input-field"
//                     placeholder="Tell us about yourself..."
//                   />
//                 </div>

//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Website
//                     </label>
//                     <input
//                       type="url"
//                       name="website"
//                       value={formData.website}
//                       onChange={handleInputChange}
//                       className="input-field"
//                       placeholder="https://example.com"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Twitter
//                     </label>
//                     <input
//                       type="text"
//                       name="twitter"
//                       value={formData.twitter}
//                       onChange={handleInputChange}
//                       className="input-field"
//                       placeholder="@username"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       GitHub
//                     </label>
//                     <input
//                       type="text"
//                       name="github"
//                       value={formData.github}
//                       onChange={handleInputChange}
//                       className="input-field"
//                       placeholder="github-username"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Phone
//                     </label>
//                     <input
//                       type="tel"
//                       name="phone"
//                       value={formData.phone}
//                       onChange={handleInputChange}
//                       className="input-field"
//                       placeholder="Your phone number"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       University
//                     </label>
//                     <input
//                       type="text"
//                       name="university"
//                       value={formData.university}
//                       onChange={handleInputChange}
//                       className="input-field"
//                       placeholder="Your university"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Course
//                     </label>
//                     <input
//                       type="text"
//                       name="course"
//                       value={formData.course}
//                       onChange={handleInputChange}
//                       className="input-field"
//                       placeholder="Your course"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Semester
//                     </label>
//                     <input
//                       type="text"
//                       name="semester"
//                       value={formData.semester}
//                       onChange={handleInputChange}
//                       className="input-field"
//                       placeholder="Your semester"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Enrollment Number
//                     </label>
//                     <input
//                       type="text"
//                       name="enrollmentNo"
//                       value={formData.enrollmentNo}
//                       onChange={handleInputChange}
//                       className="input-field"
//                       placeholder="Your enrollment number"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </form>
//           )}
//         </div>
//       </div>

//       {/* Statistics Section */}
//       <div className="bg-white rounded-xl shadow-md p-6 mt-6">
//         <h2 className="text-xl font-semibold text-gray-900 mb-6">Study Statistics</h2>
//         <div className="grid md:grid-cols-4 gap-6">
//           <div className="text-center">
//             <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
//               <span className="text-2xl font-bold text-primary-600">{stats.notesViewed}</span>
//             </div>
//             <h3 className="text-sm font-medium text-gray-700">Notes Viewed</h3>
//           </div>
          
//           <div className="text-center">
//             <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-3">
//               <span className="text-2xl font-bold text-secondary-600">{stats.downloads}</span>
//             </div>
//             <h3 className="text-sm font-medium text-gray-700">Downloads</h3>
//           </div>
          
//           <div className="text-center">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
//               <span className="text-2xl font-bold text-green-600">{stats.subjects}</span>
//             </div>
//             <h3 className="text-sm font-medium text-gray-700">Subjects</h3>
//           </div>
          
//           <div className="text-center">
//             <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
//               <span className="text-2xl font-bold text-blue-600">{stats.activeDays}</span>
//             </div>
//             <h3 className="text-sm font-medium text-gray-700">Active Days (This Month)</h3>
//           </div>
//         </div>
//       </div>

//       {/* Activity Calendar Section */}
//       <div className="bg-white rounded-xl shadow-md p-6 mt-6">
//         <h2 className="text-xl font-semibold text-gray-900 mb-6">Activity This Month</h2>
//         <div className="grid grid-cols-7 gap-2">
//           {Array.from({ length: 31 }, (_, i) => {
//             const day = i + 1;
//             const isActive = day % 3 === 0; // Example logic - replace with real data
//             return (
//               <div key={day} className="text-center">
//                 <div className={`h-8 w-8 rounded-full flex items-center justify-center mx-auto ${
//                   isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-400'
//                 }`}>
//                   {day}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//         <div className="mt-4 flex justify-center items-center text-sm text-gray-500">
//           <div className="flex items-center mr-4">
//             <div className="w-3 h-3 bg-green-100 rounded-full mr-1"></div>
//             <span>Active</span>
//           </div>
//           <div className="flex items-center">
//             <div className="w-3 h-3 bg-gray-100 rounded-full mr-1"></div>
//             <span>Inactive</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Profile