async function getRecipesByFilter(
  req,
  res
){
  const material = String(req.query.material);
  const process = String(req.query.process);
  const nationality = String(req.query.nationality);


        return this.repo
        .getRecipesByFilter(material, process, nationality)
        .then((recips)=> {
            if (!recips) {
                return res.status(404).json({ error: `no such content: ${material} or ${process} or ${nationality}` }).end()
            }
        }
        return  

        )

}
