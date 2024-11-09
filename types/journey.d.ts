type Journey = {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_public:boolean
  cover_img_url?: string;
  created_at: Date;
  updated_at: Date;
};
